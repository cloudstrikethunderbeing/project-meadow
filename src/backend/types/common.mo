// Cross-cutting shared types for Project Meadow
module {
  public type Timestamp = Int;
  public type MemberId = Text;
  public type VolunteerId = Text;

  public type Result<T, E> = { #ok : T; #err : E };

  public type VerificationStatus = {
    #pending;
    #verified;
    #rejected;
  };

  public type SearchFilters = {
    province : ?Text;
    city : ?Text;
    category : ?Text;
    verificationStatus : ?VerificationStatus;
    acceptsBitcoin : ?Bool;
    acceptsICP : ?Bool;
    circularEconomyParticipant : ?Bool;
  };

  public type CityStats = {
    city : Text;
    province : Text;
    memberCount : Nat;
    businessCount : Nat;
    producerCount : Nat;
    volunteerCount : Nat;
    totalListings : Nat;
  };

  public type StatsRecord = {
    totalMembers : Nat;
    verifiedMembers : Nat;
    pendingMembers : Nat;
    communityMembers : Nat;
    businessMembers : Nat;
    tradeMembers : Nat;
    producerMembers : Nat;
    organizationPartners : Nat;
    bitcoinEnabled : Nat;
    icpEnabled : Nat;
    circularEconomy : Nat;
    byProvince : [(Text, Nat)];
  };
}
