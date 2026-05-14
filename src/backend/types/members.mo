// Member and volunteer type definitions
import CommonTypes "common";
import MembershipTypes "membership";
import PresenceTypes "connected-presence";

module {
  public type Timestamp = CommonTypes.Timestamp;
  public type VerificationStatus = CommonTypes.VerificationStatus;

  // Unified member record for all participant types
  public type MemberRecord = {
    id : Text;
    participantType : Text; // community | business | trade | producer | organization
    businessName : Text;
    contactName : Text;
    category : Text;
    subcategory : ?Text;
    description : Text;
    city : Text;
    province : Text;
    region : ?Text;
    postalCode : ?Text;
    latitude : ?Float;
    longitude : ?Float;
    website : ?Text;
    phone : ?Text;
    socialLinks : ?Text;
    email : ?Text;
    // Connected Presence — expanded external link system (default empty array)
    connectedPresence : [PresenceTypes.ConnectedPresenceLink];
    featuredContent : ?PresenceTypes.FeaturedContent;
    acceptsBitcoin : Bool;
    acceptsICP : Bool;
    acceptsCash : Bool;
    acceptsFiat : Bool;
    paymentInstructions : ?Text;
    bitcoinAddress : ?Text;
    icpAddress : ?Text;
    oisyWalletLink : ?Text;
    paymentQrImage : ?Text;
    verificationStatus : VerificationStatus;
    circularEconomyParticipant : Bool;
    featured : Bool;
    ownerPrincipal : ?Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
    // Community trust fields
    communityUpvotes : Nat;
    communityDownvotes : Nat;
    communityVerified : Bool;
    // Values: "pending" | "verified" | "under_review"
    communityVerificationStatus : Text;
    flaggedForReview : Bool;
    votingFrozen : Bool;
    membershipStatus : MembershipTypes.ListingMembershipStatus;
  };

  // Input type for creating/updating members
  public type MemberInput = {
    participantType : Text;
    businessName : Text;
    contactName : Text;
    category : Text;
    subcategory : ?Text;
    description : Text;
    city : Text;
    province : Text;
    region : ?Text;
    postalCode : ?Text;
    latitude : ?Float;
    longitude : ?Float;
    socialLinks : ?Text;
    // Connected Presence — optional for backward compatibility
    connectedPresence : ?[PresenceTypes.ConnectedPresenceLink];
    featuredContent : ?PresenceTypes.FeaturedContent;
    website : ?Text;
    phone : ?Text;
    email : ?Text;
    acceptsBitcoin : Bool;
    acceptsICP : Bool;
    acceptsCash : Bool;
    acceptsFiat : Bool;
    paymentInstructions : ?Text;
    bitcoinAddress : ?Text;
    icpAddress : ?Text;
    oisyWalletLink : ?Text;
    paymentQrImage : ?Text;
    circularEconomyParticipant : Bool;
  };

  // Volunteer interest record
  public type VolunteerInterest = {
    id : Text;
    name : Text;
    email : Text;
    city : Text;
    skills : [Text];
    interests : [Text];
    availability : Text;
    createdAt : Timestamp;
  };

  // Input type for creating volunteers
  public type VolunteerInput = {
    name : Text;
    email : Text;
    city : Text;
    skills : [Text];
    interests : [Text];
    availability : Text;
  };
}
