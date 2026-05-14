// Community Opportunities domain types for Project Meadow
// Lightweight local participation and coordination infrastructure
module {
  /// Opportunity categories — covers all grassroots coordination use cases
  public type OpportunityCategory = {
    #volunteer;
    #education;
    #foodSupport;
    #events;
    #cleanup;
    #mentorship;
    #localFarming;
    #delivery;
    #wellness;
    #youthSupport;
    #technology;
    #creativeArts;
    #other;
  };

  /// Lifecycle status for an opportunity posting
  public type OpportunityStatus = {
    #active;
    #inactive;
  };

  /// Full community opportunity record stored in canister
  /// Future-safe: chapterId and trustScore reserved for Phase 3 upgrades
  public type CommunityOpportunity = {
    id : Nat;
    title : Text;
    description : Text;
    category : OpportunityCategory;
    city : Text;
    province : Text;
    memberId : ?Text;
    organizationName : ?Text;
    timeCommitment : ?Text;
    contactLink : ?Text;
    recurring : Bool;
    status : OpportunityStatus;
    createdAt : Int;
    updatedAt : Int;
    adminFlagged : ?Bool;
    // Phase 3 placeholders — not yet used
    chapterId : ?Text;
    trustScore : ?Nat;
  };

  /// Input type for creating or updating an opportunity
  /// Excludes system-managed fields: id, createdAt, updatedAt, adminFlagged
  public type OpportunityInput = {
    title : Text;
    description : Text;
    category : OpportunityCategory;
    city : Text;
    province : Text;
    memberId : ?Text;
    organizationName : ?Text;
    timeCommitment : ?Text;
    contactLink : ?Text;
    recurring : Bool;
    status : OpportunityStatus;
    // Phase 3 placeholders
    chapterId : ?Text;
    trustScore : ?Nat;
  };
}
