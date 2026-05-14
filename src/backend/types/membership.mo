// Membership domain types for Project Meadow
import CommonTypes "common";

module {
  public type Timestamp = CommonTypes.Timestamp;

  /// Membership tier variants
  public type MembershipTier = {
    #communitySupporterTier; // $5/month
    #builderMember;          // $10/month
    #localSponsor;           // $25/month
    #verifiedBusiness;       // $20/month or $200/year
    #localProducer;          // $10/month or $100/year
    #communityPartner;       // Free or invite-based
  };

  /// Membership intent processing status
  public type MembershipStatus = {
    #pending;
    #contacted;
    #approved;
  };

  /// Participant type for membership intent
  public type MemberParticipantType = {
    #individual;
    #business;
    #producer;
    #organization;
  };

  /// Listing-level membership status field
  public type ListingMembershipStatus = {
    #free;
    #supporter;
    #businessMember;
    #producerMember;
    #sponsor;
    #partner;
  };

  /// Full membership intent record (stored in canister)
  public type MembershipIntent = {
    id : Text;
    principal : ?Principal;
    name : Text;
    email : Text;
    city : Text;
    province : Text;
    membershipTier : MembershipTier;
    participantType : MemberParticipantType;
    message : ?Text;
    status : MembershipStatus;
    displayPublicly : Bool;
    createdAt : Timestamp;
  };

  /// Input type for creating a new membership intent
  public type MembershipIntentInput = {
    principal : ?Principal;
    name : Text;
    email : Text;
    city : Text;
    province : Text;
    membershipTier : MembershipTier;
    participantType : MemberParticipantType;
    message : ?Text;
    displayPublicly : Bool;
  };

  /// Admin-facing stats for membership intents
  public type MembershipStats = {
    total : Nat;
    byTier : [(Text, Nat)];
    byStatus : [(Text, Nat)];
    estimatedMonthlySupport : Nat;
  };
}
