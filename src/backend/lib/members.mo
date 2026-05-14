// Domain logic for member and volunteer management
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Types "../types/members";
import CommonTypes "../types/common";
import MembershipTypes "../types/membership";
import Array "mo:core/Array";

module {
  public type MemberRecord = Types.MemberRecord;
  public type MemberInput = Types.MemberInput;
  public type VolunteerInterest = Types.VolunteerInterest;
  public type VolunteerInput = Types.VolunteerInput;
  public type SearchFilters = CommonTypes.SearchFilters;
  public type StatsRecord = CommonTypes.StatsRecord;
  public type CityStats = CommonTypes.CityStats;

  // Generate a new unique ID with given prefix and counter
  public func generateId(prefix : Text, counter : Nat) : Text {
    prefix # "-" # counter.toText();
  };

  // Create a new member record from input
  public func createMemberRecord(
    id : Text,
    input : MemberInput,
    ownerPrincipal : ?Text,
    now : Int,
  ) : MemberRecord {
    {
      id;
      participantType = input.participantType;
      businessName = input.businessName;
      contactName = input.contactName;
      category = input.category;
      subcategory = input.subcategory;
      description = input.description;
      city = input.city;
      province = input.province;
      region = input.region;
      postalCode = input.postalCode;
      latitude = input.latitude;
      longitude = input.longitude;
      website = input.website;
      phone = input.phone;
      email = input.email;
      socialLinks = input.socialLinks;
      acceptsBitcoin = input.acceptsBitcoin;
      acceptsICP = input.acceptsICP;
      acceptsCash = input.acceptsCash;
      acceptsFiat = input.acceptsFiat;
      paymentInstructions = input.paymentInstructions;
      bitcoinAddress = input.bitcoinAddress;
      icpAddress = input.icpAddress;
      oisyWalletLink = input.oisyWalletLink;
      paymentQrImage = input.paymentQrImage;
      verificationStatus = #pending;
      circularEconomyParticipant = input.circularEconomyParticipant;
      featured = false;
      ownerPrincipal;
      createdAt = now;
      updatedAt = now;
      communityUpvotes = 0;
      communityDownvotes = 0;
      communityVerified = false;
      communityVerificationStatus = "pending";
      flaggedForReview = false;
      votingFrozen = false;
      membershipStatus = #free;
      connectedPresence = switch (input.connectedPresence) { case (?cp) cp; case null [] };
      featuredContent = input.featuredContent;
    };
  };

  // Update an existing member record with new data
  public func applyMemberUpdate(existing : MemberRecord, input : MemberInput, now : Int) : MemberRecord {
    {
      existing with
      participantType = input.participantType;
      businessName = input.businessName;
      contactName = input.contactName;
      category = input.category;
      subcategory = input.subcategory;
      description = input.description;
      city = input.city;
      province = input.province;
      region = input.region;
      postalCode = input.postalCode;
      latitude = input.latitude;
      longitude = input.longitude;
      website = input.website;
      phone = input.phone;
      email = input.email;
      socialLinks = input.socialLinks;
      acceptsBitcoin = input.acceptsBitcoin;
      acceptsICP = input.acceptsICP;
      acceptsCash = input.acceptsCash;
      acceptsFiat = input.acceptsFiat;
      paymentInstructions = input.paymentInstructions;
      bitcoinAddress = input.bitcoinAddress;
      icpAddress = input.icpAddress;
      oisyWalletLink = input.oisyWalletLink;
      paymentQrImage = input.paymentQrImage;
      circularEconomyParticipant = input.circularEconomyParticipant;
      updatedAt = now;
      connectedPresence = switch (input.connectedPresence) { case (?cp) cp; case null existing.connectedPresence };
      featuredContent = input.featuredContent;
    };
  };

  // Create a new volunteer record from input
  public func createVolunteerRecord(id : Text, input : VolunteerInput, now : Int) : VolunteerInterest {
    {
      id;
      name = input.name;
      email = input.email;
      city = input.city;
      skills = input.skills;
      interests = input.interests;
      availability = input.availability;
      createdAt = now;
    };
  };

  // Aggregate approved members by city and return sorted by total listings descending
  public func getCityStats(members : List.List<MemberRecord>) : [CityStats] {
    let cityMap = Map.empty<Text, CityStats>();
    members.forEach(func(m) {
      if (m.verificationStatus != #verified) return;
      let key = m.city # "|" # m.province;
      let existing : CityStats = switch (cityMap.get(key)) {
        case (?s) s;
        case null {
          {
            city = m.city;
            province = m.province;
            memberCount = 0;
            businessCount = 0;
            producerCount = 0;
            volunteerCount = 0;
            totalListings = 0;
          }
        };
      };
      let updated : CityStats = {
        existing with
        memberCount = existing.memberCount + 1;
        businessCount = existing.businessCount + (if (m.participantType == "business") 1 else 0);
        producerCount = existing.producerCount + (if (m.participantType == "producer") 1 else 0);
        totalListings = existing.totalListings + 1;
      };
      cityMap.add(key, updated);
    });
    let arr = cityMap.toArray();
    let stats = arr.map(func((_, s)) = s);
    let sorted = stats.sort(func(a, b) = Nat.compare(b.totalListings, a.totalListings));
    sorted;
  };

  // Check if a member record matches a search query (case-insensitive)
  public func matchesSearch(record : MemberRecord, searchTerm : Text) : Bool {
    let q = searchTerm.toLower();
    record.businessName.toLower().contains(#text q) or
    record.description.toLower().contains(#text q) or
    record.category.toLower().contains(#text q) or
    record.city.toLower().contains(#text q) or
    record.province.toLower().contains(#text q) or
    (switch (record.region) {
      case (?r) r.toLower().contains(#text q);
      case null false;
    });
  };

  // Apply filters to a single member record
  public func matchesFilters(record : MemberRecord, filters : SearchFilters) : Bool {
    let provinceOk = switch (filters.province) {
      case (?p) record.province.toLower() == p.toLower();
      case null true;
    };
    let cityOk = switch (filters.city) {
      case (?c) record.city.toLower() == c.toLower();
      case null true;
    };
    let categoryOk = switch (filters.category) {
      case (?cat) record.category.toLower() == cat.toLower();
      case null true;
    };
    let statusOk = switch (filters.verificationStatus) {
      case (?s) record.verificationStatus == s;
      case null true;
    };
    let btcOk = switch (filters.acceptsBitcoin) {
      case (?b) record.acceptsBitcoin == b;
      case null true;
    };
    let icpOk = switch (filters.acceptsICP) {
      case (?i) record.acceptsICP == i;
      case null true;
    };
    let circOk = switch (filters.circularEconomyParticipant) {
      case (?c) record.circularEconomyParticipant == c;
      case null true;
    };
    provinceOk and cityOk and categoryOk and statusOk and btcOk and icpOk and circOk;
  };

  // Search and filter members
  public func filterMembers(
    members : List.List<MemberRecord>,
    searchQuery : ?Text,
    filters : ?SearchFilters,
  ) : [MemberRecord] {
    let filtered = members.filter(func(record) {
      let searchOk = switch (searchQuery) {
        case (?q) if (q == "") true else matchesSearch(record, q);
        case null true;
      };
      let filtersOk = switch (filters) {
        case (?f) matchesFilters(record, f);
        case null true;
      };
      searchOk and filtersOk;
    });
    filtered.toArray();
  };

  // Compute stats from current member and volunteer lists
  public func computeStats(
    members : List.List<MemberRecord>,
    _volunteers : List.List<VolunteerInterest>,
  ) : StatsRecord {
    let provinceMap = Map.empty<Text, Nat>();
    var totalMembers = 0;
    var verifiedMembers = 0;
    var pendingMembers = 0;
    var communityMembers = 0;
    var businessMembers = 0;
    var tradeMembers = 0;
    var producerMembers = 0;
    var organizationPartners = 0;
    var bitcoinEnabled = 0;
    var icpEnabled = 0;
    var circularEconomy = 0;

    members.forEach(func(m) {
      totalMembers += 1;
      switch (m.verificationStatus) {
        case (#verified) verifiedMembers += 1;
        case (#pending) pendingMembers += 1;
        case (#rejected) {};
      };
      switch (m.participantType) {
        case "community" communityMembers += 1;
        case "business" businessMembers += 1;
        case "trade" tradeMembers += 1;
        case "producer" producerMembers += 1;
        case "organization" organizationPartners += 1;
        case _ {};
      };
      if (m.acceptsBitcoin) bitcoinEnabled += 1;
      if (m.acceptsICP) icpEnabled += 1;
      if (m.circularEconomyParticipant) circularEconomy += 1;

      let currentCount = switch (provinceMap.get(m.province)) {
        case (?c) c;
        case null 0;
      };
      provinceMap.add(m.province, currentCount + 1);
    });

    let byProvince = provinceMap.toArray();

    {
      totalMembers;
      verifiedMembers;
      pendingMembers;
      communityMembers;
      businessMembers;
      tradeMembers;
      producerMembers;
      organizationPartners;
      bitcoinEnabled;
      icpEnabled;
      circularEconomy;
      byProvince;
    };
  };
}
