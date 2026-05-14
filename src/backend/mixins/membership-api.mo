// Membership API mixin — public endpoints for the membership domain
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import CommonTypes "../types/common";
import MembershipTypes "../types/membership";
import MembershipLib "../lib/membership";
import EmailNotifications "../lib/email-notifications";

mixin (membershipIntents : List.List<MembershipTypes.MembershipIntent>) {

  public type Result<T, E> = CommonTypes.Result<T, E>;
  public type MembershipIntent = MembershipTypes.MembershipIntent;
  public type MembershipIntentInput = MembershipTypes.MembershipIntentInput;
  public type MembershipTier = MembershipTypes.MembershipTier;
  public type MembershipStatus = MembershipTypes.MembershipStatus;
  public type MembershipStats = MembershipTypes.MembershipStats;

  // Internal helper: hardcoded admin principals (must match main.mo)
  let _membershipAdmins : [Text] = ["aaaaa-aa", "2vxsx-fae"];

  func _isMembershipAdmin(caller : Principal) : Bool {
    let callerText = caller.toText();
    var found = false;
    for (p in _membershipAdmins.values()) {
      if (p == callerText) { found := true };
    };
    found;
  };

  /// Submit a new membership interest — no payment is collected
  public shared ({ caller }) func createMembershipIntent(input : MembershipIntentInput) : async Result<MembershipIntent, Text> {
    let now = Time.now();
    let id = MembershipLib.generateMembershipId(input.email);
    let principal : ?Principal = if (caller.isAnonymous()) null else ?caller;
    let intent : MembershipIntent = {
      id;
      principal;
      name = input.name;
      email = input.email;
      city = input.city;
      province = input.province;
      membershipTier = input.membershipTier;
      participantType = input.participantType;
      message = input.message;
      status = #pending;
      displayPublicly = input.displayPublicly;
      createdAt = now;
    };
    membershipIntents.add(intent);
    // Fire-and-forget email notifications — never block intent submission
    ignore EmailNotifications.sendMembershipWelcome(intent.email, intent.name, intent.city);
    ignore EmailNotifications.sendAdminNotification("membership interest", intent.name, intent.email, intent.city);
    #ok(intent);
  };

  /// Admin: list all membership intents sorted by createdAt descending
  public query ({ caller }) func getMembershipIntents() : async [MembershipIntent] {
    if (not _isMembershipAdmin(caller)) {
      return [];
    };
    let sorted = membershipIntents.sort(func(a, b) = Int.compare(b.createdAt, a.createdAt));
    sorted.toArray();
  };

  /// Admin: filter intents by tier
  public query ({ caller }) func getMembershipIntentsByTier(tier : MembershipTier) : async [MembershipIntent] {
    if (not _isMembershipAdmin(caller)) {
      return [];
    };
    membershipIntents.filter(func(i) = i.membershipTier == tier).toArray();
  };

  /// Admin: filter intents by processing status
  public query ({ caller }) func getMembershipIntentsByStatus(status : MembershipStatus) : async [MembershipIntent] {
    if (not _isMembershipAdmin(caller)) {
      return [];
    };
    membershipIntents.filter(func(i) = i.status == status).toArray();
  };

  /// Admin: update the processing status of an intent
  public shared ({ caller }) func updateMembershipIntentStatus(id : Text, newStatus : MembershipStatus) : async Result<MembershipIntent, Text> {
    if (not _isMembershipAdmin(caller)) {
      return #err("Unauthorized");
    };
    switch (membershipIntents.findIndex(func(i) = i.id == id)) {
      case null { #err("Intent not found") };
      case (?idx) {
        let current = membershipIntents.at(idx);
        let updated : MembershipIntent = { current with status = newStatus };
        membershipIntents.put(idx, updated);
        #ok(updated);
      };
    };
  };

  /// Public: list supporters who have opted in to public display
  public query func getPublicSupporters() : async [MembershipIntent] {
    membershipIntents.filter(func(i) = i.displayPublicly and i.status == #approved).toArray();
  };

  /// Admin: aggregate stats for membership dashboard
  public query func getMembershipStats() : async MembershipStats {
    let total = membershipIntents.size();

    // Tally counts per tier
    var communitySupporter = 0;
    var builderMember = 0;
    var localSponsor = 0;
    var verifiedBusiness = 0;
    var localProducer = 0;
    var communityPartner = 0;

    // Tally counts per status
    var pendingCount = 0;
    var contactedCount = 0;
    var approvedCount = 0;

    // Estimated monthly support in cents from approved intents
    var estimatedSupport = 0;

    for (intent in membershipIntents.values()) {
      // tier counts
      switch (intent.membershipTier) {
        case (#communitySupporterTier) { communitySupporter += 1 };
        case (#builderMember)          { builderMember += 1 };
        case (#localSponsor)           { localSponsor += 1 };
        case (#verifiedBusiness)       { verifiedBusiness += 1 };
        case (#localProducer)          { localProducer += 1 };
        case (#communityPartner)       { communityPartner += 1 };
      };
      // status counts
      switch (intent.status) {
        case (#pending)   { pendingCount += 1 };
        case (#contacted) { contactedCount += 1 };
        case (#approved)  {
          approvedCount += 1;
          estimatedSupport += MembershipLib.tierToPrice(intent.membershipTier);
        };
      };
    };

    {
      total;
      byTier = [
        (MembershipLib.tierToText(#communitySupporterTier), communitySupporter),
        (MembershipLib.tierToText(#builderMember),          builderMember),
        (MembershipLib.tierToText(#localSponsor),           localSponsor),
        (MembershipLib.tierToText(#verifiedBusiness),       verifiedBusiness),
        (MembershipLib.tierToText(#localProducer),          localProducer),
        (MembershipLib.tierToText(#communityPartner),       communityPartner),
      ];
      byStatus = [
        (MembershipLib.statusToText(#pending),   pendingCount),
        (MembershipLib.statusToText(#contacted), contactedCount),
        (MembershipLib.statusToText(#approved),  approvedCount),
      ];
      estimatedMonthlySupport = estimatedSupport;
    };
  };
}
