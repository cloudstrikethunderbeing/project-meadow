// Community Opportunities domain logic for Project Meadow
import List "mo:core/List";
import Time "mo:core/Time";
import CommonTypes "../types/common";
import OpportunityTypes "../types/opportunities";

module {
  public type Result<T, E> = CommonTypes.Result<T, E>;
  public type CommunityOpportunity = OpportunityTypes.CommunityOpportunity;
  public type OpportunityInput = OpportunityTypes.OpportunityInput;
  public type OpportunityCategory = OpportunityTypes.OpportunityCategory;
  public type OpportunityStatus = OpportunityTypes.OpportunityStatus;

  /// Create a new community opportunity posting from validated input.
  /// Caller provides the pre-incremented id and the list to mutate.
  public func createOpportunity(
    opportunities : List.List<CommunityOpportunity>,
    state : { var nextOpportunityId : Nat },
    input : OpportunityInput,
  ) : Result<CommunityOpportunity, Text> {
    if (input.title == "") return #err("Title is required");
    if (input.description == "") return #err("Description is required");
    if (input.city == "") return #err("City is required");
    if (input.province == "") return #err("Province is required");
    let id = state.nextOpportunityId;
    state.nextOpportunityId += 1;
    let now = Time.now();
    let record : CommunityOpportunity = {
      id;
      title = input.title;
      description = input.description;
      category = input.category;
      city = input.city;
      province = input.province;
      memberId = input.memberId;
      organizationName = input.organizationName;
      timeCommitment = input.timeCommitment;
      contactLink = input.contactLink;
      recurring = input.recurring;
      status = #active;
      createdAt = now;
      updatedAt = now;
      adminFlagged = ?false;
      chapterId = input.chapterId;
      trustScore = input.trustScore;
    };
    opportunities.add(record);
    #ok(record);
  };

  /// List opportunities with optional filtering by city (case-insensitive), category, and status.
  public func getOpportunities(
    opportunities : List.List<CommunityOpportunity>,
    city : ?Text,
    category : ?OpportunityCategory,
    status : ?OpportunityStatus,
  ) : [CommunityOpportunity] {
    opportunities.filter(func(o) {
      let cityOk = switch (city) {
        case (?c) o.city.toLower() == c.toLower();
        case null true;
      };
      let categoryOk = switch (category) {
        case (?cat) o.category == cat;
        case null true;
      };
      let statusOk = switch (status) {
        case (?s) o.status == s;
        case null true;
      };
      cityOk and categoryOk and statusOk;
    }).toArray();
  };

  /// Fetch a single opportunity by its numeric ID.
  public func getOpportunityById(
    opportunities : List.List<CommunityOpportunity>,
    id : Nat,
  ) : ?CommunityOpportunity {
    opportunities.find(func(o) { o.id == id });
  };

  /// Fetch all opportunities posted by a given member ID.
  public func getOpportunitiesByMember(
    opportunities : List.List<CommunityOpportunity>,
    memberId : Text,
  ) : [CommunityOpportunity] {
    opportunities.filter(func(o) {
      switch (o.memberId) {
        case (?mid) mid == memberId;
        case null false;
      };
    }).toArray();
  };

  /// Update the lifecycle status of an opportunity by ID.
  public func updateOpportunityStatus(
    opportunities : List.List<CommunityOpportunity>,
    id : Nat,
    status : OpportunityStatus,
  ) : Result<(), Text> {
    switch (opportunities.findIndex(func(o) { o.id == id })) {
      case null #err("Opportunity not found");
      case (?idx) {
        let existing = opportunities.at(idx);
        opportunities.put(idx, { existing with status; updatedAt = Time.now() });
        #ok(());
      };
    };
  };

  /// Admin moderation: flag or unflag an opportunity.
  /// Flagging also deactivates the opportunity.
  public func adminFlagOpportunity(
    opportunities : List.List<CommunityOpportunity>,
    id : Nat,
    flagged : Bool,
  ) : Result<(), Text> {
    switch (opportunities.findIndex(func(o) { o.id == id })) {
      case null #err("Opportunity not found");
      case (?idx) {
        let existing = opportunities.at(idx);
        let newStatus : OpportunityStatus = if (flagged) #inactive else existing.status;
        opportunities.put(idx, {
          existing with
          adminFlagged = ?flagged;
          status = newStatus;
          updatedAt = Time.now();
        });
        #ok(());
      };
    };
  };

  /// Return the most recently created active opportunities up to `limit`.
  /// Uses three-way Int comparison to avoid BigInt coercion issues.
  public func getLatestOpportunities(
    opportunities : List.List<CommunityOpportunity>,
    limit : Nat,
  ) : [CommunityOpportunity] {
    let active = opportunities.filter(func(o) { o.status == #active }).toArray();
    // Three-way comparison on Int (createdAt) — never subtract Int/BigInt values
    let sorted = active.sort(func(a, b) {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    });
    if (sorted.size() <= limit) sorted
    else sorted.sliceToArray(0, limit.toInt());
  };
}
