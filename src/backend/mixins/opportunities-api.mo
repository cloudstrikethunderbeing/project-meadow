// Community Opportunities public API mixin for Project Meadow
import List "mo:core/List";
import CommonTypes "../types/common";
import OpportunityTypes "../types/opportunities";
import OpportunitiesLib "../lib/opportunities";

mixin (opportunities : List.List<OpportunityTypes.CommunityOpportunity>, state : { var nextOpportunityId : Nat }, adminPrincipals : [Text]) {
  public type CommunityOpportunity = OpportunityTypes.CommunityOpportunity;
  public type OpportunityInput = OpportunityTypes.OpportunityInput;
  public type OpportunityCategory = OpportunityTypes.OpportunityCategory;
  public type OpportunityStatus = OpportunityTypes.OpportunityStatus;

  func checkIsAdminOpp(p : Principal) : Bool {
    let t = p.toText();
    for (a in adminPrincipals.values()) {
      if (a == t) return true;
    };
    false;
  };

  /// Create a new community opportunity — any authenticated user can post
  public shared ({ caller }) func createOpportunity(
    input : OpportunityInput
  ) : async CommonTypes.Result<CommunityOpportunity, Text> {
    if (caller.isAnonymous()) return #err("Authentication required");
    OpportunitiesLib.createOpportunity(opportunities, state, input);
  };

  /// Public query: list opportunities with optional filtering by city, category, and status
  public query func getOpportunities(
    city : ?Text,
    category : ?OpportunityCategory,
    status : ?OpportunityStatus
  ) : async [CommunityOpportunity] {
    OpportunitiesLib.getOpportunities(opportunities, city, category, status);
  };

  /// Public query: get a single opportunity by ID
  public query func getOpportunityById(
    id : Nat
  ) : async ?CommunityOpportunity {
    OpportunitiesLib.getOpportunityById(opportunities, id);
  };

  /// Public query: get all opportunities posted by a member
  public query func getOpportunitiesByMember(
    memberId : Text
  ) : async [CommunityOpportunity] {
    OpportunitiesLib.getOpportunitiesByMember(opportunities, memberId);
  };

  /// Public query: latest active opportunities for homepage display
  public query func getLatestOpportunities(
    limit : Nat
  ) : async [CommunityOpportunity] {
    OpportunitiesLib.getLatestOpportunities(opportunities, limit);
  };

  /// Owner/admin: deactivate or reactivate an opportunity
  public shared ({ caller }) func updateOpportunityStatus(
    id : Nat,
    status : OpportunityStatus
  ) : async CommonTypes.Result<(), Text> {
    if (not checkIsAdminOpp(caller)) return #err("Admin access required");
    OpportunitiesLib.updateOpportunityStatus(opportunities, id, status);
  };

  /// Admin: flag an abusive or spam opportunity
  public shared ({ caller }) func adminFlagOpportunity(
    id : Nat,
    flagged : Bool
  ) : async CommonTypes.Result<(), Text> {
    if (not checkIsAdminOpp(caller)) return #err("Admin access required");
    OpportunitiesLib.adminFlagOpportunity(opportunities, id, flagged);
  };
}
