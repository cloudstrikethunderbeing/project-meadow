// Community vote record type definitions
import MemberTypes "members";

module {
  // A single community validation action cast by a logged-in member
  public type VoteType = { #upvote; #downvote };

  public type CommunityVote = {
    voter     : Principal;
    listingId : Text;
    voteType  : VoteType;
    timestamp : Int;
  };

  // Aggregate trust counters returned for a listing
  public type TrustSummary = {
    upvotes    : Nat;
    downvotes  : Nat;
    callerVote : ?VoteType;
  };

  // Admin trust queue — full MemberRecord arrays so the admin UI can
  // display city, province, category, participantType, createdAt, etc.
  public type AdminTrustQueue = {
    pending   : [MemberTypes.MemberRecord];
    flagged   : [MemberTypes.MemberRecord];
    highTrust : [MemberTypes.MemberRecord];
  };

  // Lightweight member reference (kept for getCommunityVotes summaries)
  public type MemberRef = {
    id                          : Text;
    businessName                : Text;
    communityUpvotes            : Nat;
    communityDownvotes          : Nat;
    communityVerified           : Bool;
    communityVerificationStatus : Text;
    flaggedForReview            : Bool;
  };
}
