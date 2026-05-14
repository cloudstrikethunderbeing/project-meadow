// Domain logic for community trust / verification
import List "mo:core/List";
import Time "mo:core/Time";
import VoteTypes "../types/votes";
import TrustConfig "../types/trust-config";
import MemberTypes "../types/members";

module {
  public type CommunityVote  = VoteTypes.CommunityVote;
  public type TrustSummary   = VoteTypes.TrustSummary;
  public type MemberRecord   = MemberTypes.MemberRecord;

  // Derive trust summary for a listing from the votes list
  public func summariseVotes(
    votes     : List.List<CommunityVote>,
    listingId : Text,
  ) : TrustSummary {
    var up : Nat = 0;
    var down : Nat = 0;
    for (v in votes.values()) {
      if (v.listingId == listingId) {
        switch (v.voteType) {
          case (#upvote)   { up   += 1 };
          case (#downvote) { down += 1 };
        };
      };
    };
    { upvotes = up; downvotes = down; callerVote = null };
  };

  // Determine whether a listing qualifies for Community Verified status.
  // Returns updated member record with recalculated trust fields.
  public func recalcTrustStatus(
    member  : MemberRecord,
    summary : TrustSummary,
    now     : Int,
  ) : MemberRecord {
    let ageNs : Int = now - member.createdAt;
    let oneDayNs : Int = 86_400_000_000_000;
    let ageDays : Int = ageNs / oneDayNs;
    let oldEnough  = ageDays >= TrustConfig.MIN_AGE_DAYS.toInt();
    let flagged    = summary.downvotes >= TrustConfig.MAX_DOWNVOTES_BEFORE_REVIEW;
    let verified   =
      summary.upvotes  >= TrustConfig.MIN_UPVOTES and
      summary.upvotes  >  summary.downvotes       and
      oldEnough                                   and
      not flagged                                 and
      not member.votingFrozen;
    let status : Text =
      if (verified)      { "verified"    }
      else if (flagged)  { "under_review" }
      else               { "pending"      };
    {
      member with
      communityUpvotes             = summary.upvotes;
      communityDownvotes           = summary.downvotes;
      communityVerified            = verified;
      communityVerificationStatus  = status;
      flaggedForReview             = flagged;
    };
  };
}
