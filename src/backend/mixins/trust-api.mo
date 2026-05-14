// Public API mixin for community trust / verification
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/members";
import CommonTypes "../types/common";
import VoteTypes "../types/votes";
import TrustLib "../lib/trust";
import ActivityTypes "../types/activity";
import ActivityLib "../lib/activity";

mixin (
  members         : List.List<Types.MemberRecord>,
  votes           : List.List<VoteTypes.CommunityVote>,
  adminPrincipals : [Text],
  activities      : List.List<ActivityTypes.ActivityEvent>,
) {

  // --- Helpers ---

  func checkIsAdminLocal(caller : Principal) : Bool {
    let callerText = caller.toText();
    for (p in adminPrincipals.values()) {
      if (p == callerText) { return true };
    };
    false;
  };

  func callerVoteFor(caller : Principal, listingId : Text) : ?VoteTypes.VoteType {
    switch (votes.find(func(v : VoteTypes.CommunityVote) : Bool { v.voter == caller and v.listingId == listingId })) {
      case (?v)  { ?v.voteType };
      case null  { null };
    };
  };

  func memberToRef(m : Types.MemberRecord) : VoteTypes.MemberRef {
    {
      id                          = m.id;
      businessName                = m.businessName;
      communityUpvotes            = m.communityUpvotes;
      communityDownvotes          = m.communityDownvotes;
      communityVerified           = m.communityVerified;
      communityVerificationStatus = m.communityVerificationStatus;
      flaggedForReview            = m.flaggedForReview;
    };
  };

  // --- Community trust write methods (authenticated) ---

  /// Cast an upvote or downvote for a listing.
  /// One vote per principal per listing — duplicates are rejected.
  /// If caller already voted with a different type, the old vote is replaced.
  public shared ({ caller }) func addCommunityVote(
    listingId : Text,
    voteType  : VoteTypes.VoteType,
  ) : async CommonTypes.Result<Text, Text> {
    // Find the target member
    switch (members.find(func(m : Types.MemberRecord) : Bool { m.id == listingId })) {
      case null { return #err("listing_not_found") };
      case (?m) {
        if (m.votingFrozen) { return #err("voting_frozen") };
        // Check for existing vote
        switch (callerVoteFor(caller, listingId)) {
          case (?existing) {
            if (existing == voteType) { return #err("already_voted") };
            // Replace vote in-place
            votes.mapInPlace(
              func(v : VoteTypes.CommunityVote) : VoteTypes.CommunityVote {
                if (v.voter == caller and v.listingId == listingId) {
                  { v with voteType = voteType; timestamp = Time.now() };
                } else { v };
              }
            );
          };
          case null {
            // New vote
            votes.add({
              voter     = caller;
              listingId = listingId;
              voteType  = voteType;
              timestamp = Time.now();
            });
          };
        };
        // Recompute trust status
        let summary = TrustLib.summariseVotes(votes, listingId);
        let updated = TrustLib.recalcTrustStatus(m, summary, Time.now());
        let wasVerified = m.communityVerified;
        members.mapInPlace(
          func(r : Types.MemberRecord) : Types.MemberRecord {
            if (r.id == listingId) { updated } else { r };
          }
        );
        // Auto-generate listing_verified event when status transitions to verified
        if (not wasVerified and updated.communityVerified) {
          let evt = ActivityLib.createEvent(
            "listing_verified",
            m.businessName # " became Community Verified",
            "Community members verified " # m.businessName # " in " # m.city # ", " # m.province,
            m.city,
            m.province,
            ?m.id,
            null,
          );
          activities.add(evt);
        };
        #ok("vote_recorded");
      };
    };
  };

  /// Retract a previously cast vote for a listing.
  public shared ({ caller }) func removeCommunityVote(
    listingId : Text,
  ) : async CommonTypes.Result<Text, Text> {
    switch (callerVoteFor(caller, listingId)) {
      case null { return #err("no_vote_found") };
      case (?_) {
        // Remove the vote
        let filtered = votes.filter(
          func(v : VoteTypes.CommunityVote) : Bool {
            not (v.voter == caller and v.listingId == listingId);
          }
        );
        votes.clear();
        votes.append(filtered);
        // Recompute trust status for member
        switch (members.find(func(m : Types.MemberRecord) : Bool { m.id == listingId })) {
          case null {};
          case (?m) {
            let summary = TrustLib.summariseVotes(votes, listingId);
            let updated = TrustLib.recalcTrustStatus(m, summary, Time.now());
            members.mapInPlace(
              func(r : Types.MemberRecord) : Types.MemberRecord {
                if (r.id == listingId) { updated } else { r };
              }
            );
          };
        };
        #ok("vote_removed");
      };
    };
  };

  // --- Community trust read methods ---

  /// Return aggregate upvote / downvote counts plus the caller's current vote for a listing.
  public shared query ({ caller }) func getCommunityVotes(
    listingId : Text,
  ) : async CommonTypes.Result<VoteTypes.TrustSummary, Text> {
    let base = TrustLib.summariseVotes(votes, listingId);
    #ok({ base with callerVote = callerVoteFor(caller, listingId) });
  };

  /// Return caller's existing vote for a listing, if any.
  public shared query ({ caller }) func getMyVote(
    listingId : Text,
  ) : async ?VoteTypes.VoteType {
    callerVoteFor(caller, listingId);
  };

  // --- Admin-only trust override methods ---

  /// Admin: manually set the community verification status for a listing.
  /// Accepted values: "pending" | "verified" | "under_review"
  public shared ({ caller }) func overrideTrustStatus(
    memberId  : Text,
    newStatus : Text,
  ) : async CommonTypes.Result<Text, Text> {
    if (not checkIsAdminLocal(caller)) { return #err("unauthorized") };
    var found = false;
    members.mapInPlace(
      func(m : Types.MemberRecord) : Types.MemberRecord {
        if (m.id == memberId) {
          found := true;
          {
            m with
            communityVerificationStatus = newStatus;
            communityVerified           = (newStatus == "verified");
            flaggedForReview            = (newStatus == "under_review");
          };
        } else { m };
      }
    );
    if (found) { #ok("status_updated") } else { #err("member_not_found") };
  };

  /// Admin: freeze or unfreeze community voting on a listing.
  public shared ({ caller }) func freezeVoting(
    memberId : Text,
    frozen   : Bool,
  ) : async CommonTypes.Result<Text, Text> {
    if (not checkIsAdminLocal(caller)) { return #err("unauthorized") };
    var found = false;
    members.mapInPlace(
      func(m : Types.MemberRecord) : Types.MemberRecord {
        if (m.id == memberId) {
          found := true;
          { m with votingFrozen = frozen };
        } else { m };
      }
    );
    if (found) { #ok("freeze_updated") } else { #err("member_not_found") };
  };

  /// Admin: returns pending, flagged, and high-trust listings for moderation.
  public shared query ({ caller }) func getAdminTrustQueue() : async CommonTypes.Result<VoteTypes.AdminTrustQueue, Text> {
    if (not checkIsAdminLocal(caller)) { return #err("unauthorized") };
    let pending   = members.filter(func(m : Types.MemberRecord) : Bool {
      m.communityVerificationStatus == "pending" and m.communityUpvotes > 0
    }).toArray();
    let flagged   = members.filter(func(m : Types.MemberRecord) : Bool {
      m.flaggedForReview
    }).toArray();
    let highTrust = members.filter(func(m : Types.MemberRecord) : Bool {
      m.communityVerified
    }).toArray();
    #ok({ pending; flagged; highTrust });
  };
}
