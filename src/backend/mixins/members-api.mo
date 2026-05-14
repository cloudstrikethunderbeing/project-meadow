// Public API mixin for member and volunteer management
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/members";
import CommonTypes "../types/common";
import MembersLib "../lib/members";
import ActivityTypes "../types/activity";
import ActivityLib "../lib/activity";
import EmailNotifications "../lib/email-notifications";

mixin (
  members : List.List<Types.MemberRecord>,
  volunteers : List.List<Types.VolunteerInterest>,
  state : { var nextMemberId : Nat; var nextVolunteerId : Nat },
  adminPrincipals : [Text],
  activities : List.List<ActivityTypes.ActivityEvent>,
) {

  // Helper: check if a principal is admin
  func checkIsAdmin(p : Principal) : Bool {
    let t = p.toText();
    for (a in adminPrincipals.values()) {
      if (a == t) return true;
    };
    false;
  };

  // Helper: find member by id and return its list index
  func findMemberIndex(id : Text) : ?Nat {
    members.findIndex(func(m) { m.id == id });
  };

  // --- Public read methods ---

  public query func getMembers(
    searchQuery : ?Text,
    filters : ?CommonTypes.SearchFilters,
  ) : async [Types.MemberRecord] {
    MembersLib.filterMembers(members, searchQuery, filters);
  };

  public query func getMember(id : Text) : async ?Types.MemberRecord {
    members.find(func(m) { m.id == id });
  };

  // --- Authenticated write methods ---

  public shared ({ caller }) func createMember(
    memberData : Types.MemberInput,
  ) : async CommonTypes.Result<Text, Text> {
    if (caller.isAnonymous()) return #err("Authentication required");
    let id = MembersLib.generateId("m", state.nextMemberId);
    state.nextMemberId += 1;
    let record = MembersLib.createMemberRecord(id, memberData, ?caller.toText(), Time.now());
    members.add(record);
    // Fire-and-forget email notifications — never block signup
    switch (memberData.email) {
      case (?addr) {
        ignore EmailNotifications.sendMemberProfileActive(addr, memberData.businessName, memberData.city);
        ignore EmailNotifications.sendAdminNotification("member signup", memberData.businessName, addr, memberData.city);
      };
      case null {};
    };
    #ok(id);
  };

  public shared ({ caller }) func updateMember(
    id : Text,
    memberData : Types.MemberInput,
  ) : async CommonTypes.Result<(), Text> {
    if (caller.isAnonymous()) return #err("Authentication required");
    let isAdminCaller = checkIsAdmin(caller);
    switch (findMemberIndex(id)) {
      case null #err("Member not found");
      case (?idx) {
        let existing = members.at(idx);
        let isOwner = switch (existing.ownerPrincipal) {
          case (?op) op == caller.toText();
          case null false;
        };
        if (not isOwner and not isAdminCaller) {
          return #err("Not authorized");
        };
        members.put(idx, MembersLib.applyMemberUpdate(existing, memberData, Time.now()));
        #ok(());
      };
    };
  };

  // --- Admin-only methods ---

  public shared ({ caller }) func deleteMember(id : Text) : async CommonTypes.Result<(), Text> {
    if (not checkIsAdmin(caller)) return #err("Admin access required");
    switch (findMemberIndex(id)) {
      case null #err("Member not found");
      case (?idx) {
        switch (members.removeLast()) {
          case null {}; // list was already empty
          case (?lastItem) {
            // If idx is not the last position, fill the gap
            if (idx < members.size()) {
              members.put(idx, lastItem);
            };
          };
        };
        #ok(());
      };
    };
  };

  func setVerificationStatus(
    caller : Principal,
    id : Text,
    status : CommonTypes.VerificationStatus,
  ) : CommonTypes.Result<(), Text> {
    if (not checkIsAdmin(caller)) return #err("Admin access required");
    switch (findMemberIndex(id)) {
      case null #err("Member not found");
      case (?idx) {
        let existing = members.at(idx);
        members.put(idx, { existing with verificationStatus = status; updatedAt = Time.now() });
        #ok(());
      };
    };
  };

  public shared ({ caller }) func approveMember(id : Text) : async CommonTypes.Result<(), Text> {
    let result = setVerificationStatus(caller, id, #verified);
    // Auto-generate activity event on approval
    switch (result) {
      case (#ok(_)) {
        switch (members.find(func(m : Types.MemberRecord) : Bool { m.id == id })) {
          case (?m) {
            let eventType = switch (m.participantType) {
              case ("producer")     { "producer_joined"      };
              case ("trade")        { "trades_joined"        };
              case ("organization") { "organization_joined"  };
              case (_)              { "business_joined"      };
            };
            let evt = ActivityLib.createEvent(
              eventType,
              m.businessName # " joined the network",
              m.businessName # " joined as a verified " # m.participantType # " in " # m.city # ", " # m.province,
              m.city,
              m.province,
              ?m.id,
              null,
            );
            activities.add(evt);
          };
          case null {};
        };
      };
      case (#err(_)) {};
    };
    result;
  };

  public shared ({ caller }) func rejectMember(id : Text) : async CommonTypes.Result<(), Text> {
    setVerificationStatus(caller, id, #rejected);
  };

  public shared ({ caller }) func featureMember(
    id : Text,
    featured : Bool,
  ) : async CommonTypes.Result<(), Text> {
    if (not checkIsAdmin(caller)) return #err("Admin access required");
    switch (findMemberIndex(id)) {
      case null #err("Member not found");
      case (?idx) {
        let existing = members.at(idx);
        members.put(idx, { existing with featured; updatedAt = Time.now() });
        #ok(());
      };
    };
  };

  // --- Volunteer methods ---

  public shared ({ caller }) func createVolunteer(
    volunteerData : Types.VolunteerInput,
  ) : async CommonTypes.Result<Text, Text> {
    if (caller.isAnonymous()) return #err("Authentication required");
    let id = MembersLib.generateId("v", state.nextVolunteerId);
    state.nextVolunteerId += 1;
    let record = MembersLib.createVolunteerRecord(id, volunteerData, Time.now());
    volunteers.add(record);
    // Fire-and-forget email notifications — never block signup
    ignore EmailNotifications.sendVolunteerConfirmation(volunteerData.email, volunteerData.name, volunteerData.city);
    ignore EmailNotifications.sendAdminNotification("volunteer signup", volunteerData.name, volunteerData.email, volunteerData.city);
    // Auto-generate volunteer joined activity event
    let evt = ActivityLib.createEvent(
      "volunteer_joined",
      volunteerData.name # " joined as a Community Volunteer in " # volunteerData.city,
      "A new community volunteer joined the network in " # volunteerData.city # ", supporting local resilience efforts.",
      volunteerData.city,
      "",
      null,
      null,
    );
    activities.add(evt);
    #ok(id);
  };

  public shared ({ caller }) func getVolunteers() : async [Types.VolunteerInterest] {
    if (not checkIsAdmin(caller)) Runtime.trap("Admin access required");
    volunteers.toArray();
  };

  // --- Stats ---

  public shared ({ caller }) func getStats() : async CommonTypes.StatsRecord {
    if (not checkIsAdmin(caller)) Runtime.trap("Admin access required");
    MembersLib.computeStats(members, volunteers);
  };

  public query func getCityStats() : async [CommonTypes.CityStats] {
    MembersLib.getCityStats(members);
  };

  // --- Admin check ---

  public query func isAdmin(p : Principal) : async Bool {
    checkIsAdmin(p);
  };
}
