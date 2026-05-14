
import List "mo:core/List";
import Types "types/members";
import MembersApi "mixins/members-api";
import VoteTypes "types/votes";
import TrustApi "mixins/trust-api";

import ActivityTypes "types/activity";
import ActivityApi "mixins/activity-api";
import MembershipTypes "types/membership";
import MembershipApi "mixins/membership-api";
import OpportunityTypes "types/opportunities";
import OpportunitiesApi "mixins/opportunities-api";





actor {
  let members = List.empty<Types.MemberRecord>();
  let volunteers = List.empty<Types.VolunteerInterest>();
  let votes = List.empty<VoteTypes.CommunityVote>();
  let state = { var nextMemberId : Nat = 0; var nextVolunteerId : Nat = 0 };

  // Hardcoded admin principals — replace with real principals before production
  let adminPrincipals : [Text] = [
    "aaaaa-aa",
    "2vxsx-fae",
  ];

  // Initialize members from seed data on first load (local — not stable state)
  do {
    if (members.size() == 0) {
      let seedData : [Types.MemberRecord] = [
        {
          id = "seed-0";
          participantType = "producer";
          businessName = "Sunrise Valley Farm";
          contactName = "Marie Tremblay";
          category = "Food Producers";
          subcategory = ?"Vegetables & Produce";
          description = "Family-operated organic vegetable farm growing seasonal produce, eggs, and herbs. CSA boxes available weekly.";
          city = "Québec City";
          province = "QC";
          region = ?"Capitale-Nationale";
          postalCode = ?"G1R 4S9";
          latitude = ?46.8139;
          longitude = ?(-71.2080);
          website = ?"https://sunrisevalleyfarm.ca";
          phone = ?("418-555-0101");
          email = ?("info@sunrisevalleyfarm.ca");
          socialLinks = null;
          connectedPresence = [];
          featuredContent = null;
          acceptsBitcoin = false;
          acceptsICP = false;
          acceptsCash = true;
          acceptsFiat = true;
          paymentInstructions = null;
          bitcoinAddress = null;
          icpAddress = null;
          oisyWalletLink = null;
          paymentQrImage = null;
          verificationStatus = #verified;
          circularEconomyParticipant = true;
          featured = true;
          ownerPrincipal = null;
          createdAt = 1715000000000000000;
          updatedAt = 1715000000000000000;
          communityUpvotes = 0;
          communityDownvotes = 0;
          communityVerified = false;
          communityVerificationStatus = "pending";
          flaggedForReview = false;
          votingFrozen = false;
          membershipStatus = #free;
        },
        {
          id = "seed-1";
          participantType = "trade";
          businessName = "West Coast Carpentry Co.";
          contactName = "James Nakamura";
          category = "Trades";
          subcategory = ?"Carpentry";
          description = "Custom woodworking, renovations, and finish carpentry serving the Greater Vancouver area. 20 years experience.";
          city = "Vancouver";
          province = "BC";
          region = ?"Lower Mainland";
          postalCode = ?"V5K 0A1";
          latitude = ?49.2827;
          longitude = ?(-123.1207);
          website = null;
          phone = ?("604-555-0202");
          email = ?("james@westcoastcarpentry.ca");
          socialLinks = null;
          connectedPresence = [];
          featuredContent = null;
          acceptsBitcoin = true;
          acceptsICP = false;
          acceptsCash = true;
          acceptsFiat = true;
          paymentInstructions = ?("Bitcoin accepted for full project quotes");
          bitcoinAddress = null;
          icpAddress = null;
          oisyWalletLink = null;
          paymentQrImage = null;
          verificationStatus = #verified;
          circularEconomyParticipant = false;
          featured = false;
          ownerPrincipal = null;
          createdAt = 1715100000000000000;
          updatedAt = 1715100000000000000;
          communityUpvotes = 0;
          communityDownvotes = 0;
          communityVerified = false;
          communityVerificationStatus = "pending";
          flaggedForReview = false;
          votingFrozen = false;
          membershipStatus = #free;
        },
        {
          id = "seed-2";
          participantType = "business";
          businessName = "Prairie Collective Grocery";
          contactName = "Sarah Kowalski";
          category = "Services";
          subcategory = ?"Local Groceries";
          description = "Community-owned cooperative grocery store stocking local and regional products. Member discounts and bulk buying available.";
          city = "Calgary";
          province = "AB";
          region = ?"Southern Alberta";
          postalCode = ?"T2P 1J9";
          latitude = ?51.0447;
          longitude = ?(-114.0719);
          website = ?"https://prairiecollective.ca";
          phone = ?("403-555-0303");
          email = ?("hello@prairiecollective.ca");
          socialLinks = null;
          connectedPresence = [];
          featuredContent = null;
          acceptsBitcoin = false;
          acceptsICP = true;
          acceptsCash = true;
          acceptsFiat = true;
          paymentInstructions = ?("ICP wallet: OISY supported");
          bitcoinAddress = null;
          icpAddress = null;
          oisyWalletLink = null;
          paymentQrImage = null;
          verificationStatus = #verified;
          circularEconomyParticipant = true;
          featured = true;
          ownerPrincipal = null;
          createdAt = 1715200000000000000;
          updatedAt = 1715200000000000000;
          communityUpvotes = 0;
          communityDownvotes = 0;
          communityVerified = false;
          communityVerificationStatus = "pending";
          flaggedForReview = false;
          votingFrozen = false;
          membershipStatus = #free;
        },
        {
          id = "seed-3";
          participantType = "organization";
          businessName = "Toronto Food Recovery Network";
          contactName = "David Osei";
          category = "Community";
          subcategory = ?"Food Recovery";
          description = "Non-profit coordinating food rescue operations across Toronto. We redirect surplus food from retailers to community kitchens and shelters.";
          city = "Toronto";
          province = "ON";
          region = ?"Greater Toronto Area";
          postalCode = ?"M5V 2H1";
          latitude = ?43.6532;
          longitude = ?(-79.3832);
          website = ?"https://torontofoodrecovery.org";
          phone = ?("416-555-0404");
          email = ?("connect@torontofoodrecovery.org");
          socialLinks = null;
          connectedPresence = [];
          featuredContent = null;
          acceptsBitcoin = false;
          acceptsICP = false;
          acceptsCash = false;
          acceptsFiat = true;
          paymentInstructions = null;
          bitcoinAddress = null;
          icpAddress = null;
          oisyWalletLink = null;
          paymentQrImage = null;
          verificationStatus = #verified;
          circularEconomyParticipant = true;
          featured = false;
          ownerPrincipal = null;
          createdAt = 1715300000000000000;
          updatedAt = 1715300000000000000;
          communityUpvotes = 0;
          communityDownvotes = 0;
          communityVerified = false;
          communityVerificationStatus = "pending";
          flaggedForReview = false;
          votingFrozen = false;
          membershipStatus = #free;
        },
        {
          id = "seed-4";
          participantType = "trade";
          businessName = "Green Thumb Landscaping";
          contactName = "Priya Sharma";
          category = "Trades";
          subcategory = ?"Landscaping";
          description = "Sustainable landscaping services using native plants and water-wise design. Residential and commercial projects in Edmonton.";
          city = "Edmonton";
          province = "AB";
          region = ?"Edmonton Metro";
          postalCode = ?"T5J 1R8";
          latitude = ?53.5461;
          longitude = ?(-113.4938);
          website = null;
          phone = ?("780-555-0505");
          email = ?("priya@greenthumbedmonton.ca");
          socialLinks = null;
          connectedPresence = [];
          featuredContent = null;
          acceptsBitcoin = true;
          acceptsICP = true;
          acceptsCash = true;
          acceptsFiat = true;
          paymentInstructions = ?("Bitcoin Lightning or on-chain accepted");
          bitcoinAddress = null;
          icpAddress = null;
          oisyWalletLink = null;
          paymentQrImage = null;
          verificationStatus = #pending;
          circularEconomyParticipant = true;
          featured = false;
          ownerPrincipal = null;
          createdAt = 1715400000000000000;
          updatedAt = 1715400000000000000;
          communityUpvotes = 0;
          communityDownvotes = 0;
          communityVerified = false;
          communityVerificationStatus = "pending";
          flaggedForReview = false;
          votingFrozen = false;
          membershipStatus = #free;
        },
        {
          id = "seed-5";
          participantType = "producer";
          businessName = "Coastal Greenhouse Co-op";
          contactName = "Thomas Bergeron";
          category = "Food Producers";
          subcategory = ?"Greenhouse";
          description = "Worker-owned greenhouse growing year-round tomatoes, peppers, and herbs. Available at local markets and direct delivery.";
          city = "Halifax";
          province = "NS";
          region = ?"Halifax Regional Municipality";
          postalCode = ?"B3J 3C4";
          latitude = ?44.6488;
          longitude = ?(-63.5752);
          website = ?"https://coastalgreenhouse.ca";
          phone = ?("902-555-0606");
          email = ?("orders@coastalgreenhouse.ca");
          socialLinks = null;
          connectedPresence = [];
          featuredContent = null;
          acceptsBitcoin = false;
          acceptsICP = false;
          acceptsCash = true;
          acceptsFiat = true;
          paymentInstructions = null;
          bitcoinAddress = null;
          icpAddress = null;
          oisyWalletLink = null;
          paymentQrImage = null;
          verificationStatus = #verified;
          circularEconomyParticipant = true;
          featured = false;
          ownerPrincipal = null;
          createdAt = 1715500000000000000;
          updatedAt = 1715500000000000000;
          communityUpvotes = 0;
          communityDownvotes = 0;
          communityVerified = false;
          communityVerificationStatus = "pending";
          flaggedForReview = false;
          votingFrozen = false;
          membershipStatus = #free;
        },
        {
          id = "seed-6";
          participantType = "business";
          businessName = "ICP Web Solutions";
          contactName = "Alex Chen";
          category = "Services";
          subcategory = ?"Web Design";
          description = "Web design and development studio specializing in decentralized applications and community platforms. ICP-native development.";
          city = "Vancouver";
          province = "BC";
          region = ?"Metro Vancouver";
          postalCode = ?"V6B 2W9";
          latitude = ?49.2827;
          longitude = ?(-123.1207);
          website = ?"https://icpwebsolutions.ca";
          phone = null;
          email = ?("hello@icpwebsolutions.ca");
          socialLinks = null;
          connectedPresence = [];
          featuredContent = null;
          acceptsBitcoin = true;
          acceptsICP = true;
          acceptsCash = false;
          acceptsFiat = true;
          paymentInstructions = ?("Bitcoin and ICP preferred. OISY wallet supported.");
          bitcoinAddress = null;
          icpAddress = null;
          oisyWalletLink = null;
          paymentQrImage = null;
          verificationStatus = #pending;
          circularEconomyParticipant = false;
          featured = false;
          ownerPrincipal = null;
          createdAt = 1715600000000000000;
          updatedAt = 1715600000000000000;
          communityUpvotes = 0;
          communityDownvotes = 0;
          communityVerified = false;
          communityVerificationStatus = "pending";
          flaggedForReview = false;
          votingFrozen = false;
          membershipStatus = #free;
        },
        {
          id = "seed-7";
          participantType = "organization";
          businessName = "Montréal Affordability Coalition";
          contactName = "Isabelle Leblanc";
          category = "Community";
          subcategory = ?"Affordability";
          description = "Coalition of community groups working to reduce cost-of-living pressures through bulk buying, mutual aid, and local economic development.";
          city = "Montréal";
          province = "QC";
          region = ?"Greater Montréal";
          postalCode = ?"H2Y 1C6";
          latitude = ?45.5017;
          longitude = ?(-73.5673);
          website = ?"https://affordablemtl.org";
          phone = ?("514-555-0707");
          email = ?("info@affordablemtl.org");
          socialLinks = null;
          connectedPresence = [];
          featuredContent = null;
          acceptsBitcoin = false;
          acceptsICP = false;
          acceptsCash = false;
          acceptsFiat = true;
          paymentInstructions = null;
          bitcoinAddress = null;
          icpAddress = null;
          oisyWalletLink = null;
          paymentQrImage = null;
          verificationStatus = #verified;
          circularEconomyParticipant = true;
          featured = true;
          ownerPrincipal = null;
          createdAt = 1715700000000000000;
          updatedAt = 1715700000000000000;
          communityUpvotes = 0;
          communityDownvotes = 0;
          communityVerified = false;
          communityVerificationStatus = "pending";
          flaggedForReview = false;
          votingFrozen = false;
          membershipStatus = #free;
        },
        {
          id = "seed-8";
          participantType = "trade";
          businessName = "Northern Electric Services";
          contactName = "Mike Fiddler";
          category = "Trades";
          subcategory = ?"Electrical";
          description = "Licensed electrician offering residential wiring, panel upgrades, and EV charger installation across the Greater Ottawa area.";
          city = "Ottawa";
          province = "ON";
          region = ?"National Capital Region";
          postalCode = ?"K1A 0A1";
          latitude = ?45.4215;
          longitude = ?(-75.6972);
          website = null;
          phone = ?("613-555-0808");
          email = ?("mike@northernelectric.ca");
          socialLinks = null;
          connectedPresence = [];
          featuredContent = null;
          acceptsBitcoin = false;
          acceptsICP = false;
          acceptsCash = true;
          acceptsFiat = true;
          paymentInstructions = null;
          bitcoinAddress = null;
          icpAddress = null;
          oisyWalletLink = null;
          paymentQrImage = null;
          verificationStatus = #verified;
          circularEconomyParticipant = false;
          featured = false;
          ownerPrincipal = null;
          createdAt = 1715800000000000000;
          updatedAt = 1715800000000000000;
          communityUpvotes = 0;
          communityDownvotes = 0;
          communityVerified = false;
          communityVerificationStatus = "pending";
          flaggedForReview = false;
          votingFrozen = false;
          membershipStatus = #free;
        },
        {
          id = "seed-9";
          participantType = "producer";
          businessName = "Fraser Valley Dairy Direct";
          contactName = "Anna Hofer";
          category = "Food Producers";
          subcategory = ?"Dairy";
          description = "Small-scale dairy farm offering raw milk (where permitted), artisan cheese, and butter. Direct farm gate sales and delivery routes.";
          city = "Abbotsford";
          province = "BC";
          region = ?"Fraser Valley";
          postalCode = ?"V2S 4N2";
          latitude = ?49.0504;
          longitude = ?(-122.3045);
          website = ?"https://fraservalleydairy.ca";
          phone = ?("604-555-0909");
          email = ?("anna@fraservalleydairy.ca");
          socialLinks = null;
          connectedPresence = [];
          featuredContent = null;
          acceptsBitcoin = true;
          acceptsICP = false;
          acceptsCash = true;
          acceptsFiat = true;
          paymentInstructions = ?("Bitcoin accepted — scan QR at farm gate");
          bitcoinAddress = null;
          icpAddress = null;
          oisyWalletLink = null;
          paymentQrImage = null;
          verificationStatus = #verified;
          circularEconomyParticipant = true;
          featured = false;
          ownerPrincipal = null;
          createdAt = 1715900000000000000;
          updatedAt = 1715900000000000000;
          communityUpvotes = 0;
          communityDownvotes = 0;
          communityVerified = false;
          communityVerificationStatus = "pending";
          flaggedForReview = false;
          votingFrozen = false;
          membershipStatus = #free;
        },
      ];
      for (record in seedData.values()) {
        members.add(record);
      };
      state.nextMemberId := 100;
    };
  };

  let activities = List.empty<ActivityTypes.ActivityEvent>();
  let membershipIntents = List.empty<MembershipTypes.MembershipIntent>();
  let opportunities = List.empty<OpportunityTypes.CommunityOpportunity>();
  let opportunityState = { var nextOpportunityId : Nat = 0 };

  // Seed activity events for initial demo feel (guard: only on first install)
  do {
    if (activities.size() == 0) {
      let seedEvents : [ActivityTypes.ActivityEvent] = [
        {
          id = "seed-evt-0";
          eventType = "producer_joined";
          title = "Green Valley Farms joined Vancouver Chapter";
          description = "Green Valley Farms joined the network as a verified local food producer in Vancouver, BC.";
          city = "Vancouver";
          province = "BC";
          relatedListingId = null;
          relatedChapterId = ?"chapter-vancouver";
          timestamp = 1715000000000000000;
        },
        {
          id = "seed-evt-1";
          eventType = "listing_verified";
          title = "Local Roots Produce became Community Verified";
          description = "4 community members verified Local Roots Produce in Calgary, AB.";
          city = "Calgary";
          province = "AB";
          relatedListingId = null;
          relatedChapterId = null;
          timestamp = 1715200000000000000;
        },
        {
          id = "seed-evt-2";
          eventType = "affordability_program";
          title = "Vancouver Food Recovery added affordable produce listings";
          description = "Vancouver Food Recovery Network added new affordable produce listings for local families.";
          city = "Vancouver";
          province = "BC";
          relatedListingId = null;
          relatedChapterId = null;
          timestamp = 1715400000000000000;
        },
        {
          id = "seed-evt-3";
          eventType = "volunteer_joined";
          title = "Sarah joined as a Community Volunteer in Calgary";
          description = "A new community volunteer joined the network in Calgary, AB, supporting local resilience efforts.";
          city = "Calgary";
          province = "AB";
          relatedListingId = null;
          relatedChapterId = null;
          timestamp = 1715600000000000000;
        },
        {
          id = "seed-evt-4";
          eventType = "trades_joined";
          title = "North Shore Trades became Community Verified";
          description = "North Shore Trades joined the network as a verified tradesperson in Vancouver, BC.";
          city = "Vancouver";
          province = "BC";
          relatedListingId = null;
          relatedChapterId = null;
          timestamp = 1715800000000000000;
        },
        {
          id = "seed-evt-5";
          eventType = "chapter_created";
          title = "Community chapter launched in Edmonton";
          description = "A new community chapter was launched in Edmonton, AB, bringing together local businesses and producers.";
          city = "Edmonton";
          province = "AB";
          relatedListingId = null;
          relatedChapterId = ?"chapter-edmonton";
          timestamp = 1716000000000000000;
        },
        {
          id = "seed-evt-6";
          eventType = "organization_joined";
          title = "Montréal Affordability Coalition partnered with the network";
          description = "The Montréal Affordability Coalition joined as an organizational partner in Montréal, QC.";
          city = "Montréal";
          province = "QC";
          relatedListingId = null;
          relatedChapterId = null;
          timestamp = 1716200000000000000;
        },
        {
          id = "seed-evt-7";
          eventType = "producer_joined";
          title = "Coastal Greenhouse Co-op joined Halifax Chapter";
          description = "Coastal Greenhouse Co-op joined the network as a verified producer in Halifax, NS.";
          city = "Halifax";
          province = "NS";
          relatedListingId = null;
          relatedChapterId = ?"chapter-halifax";
          timestamp = 1716400000000000000;
        },
        {
          id = "seed-evt-8";
          eventType = "business_joined";
          title = "Prairie Collective Grocery joined Calgary Chapter";
          description = "Prairie Collective Grocery joined as a verified community business in Calgary, AB.";
          city = "Calgary";
          province = "AB";
          relatedListingId = null;
          relatedChapterId = ?"chapter-calgary";
          timestamp = 1716600000000000000;
        },
        {
          id = "seed-evt-9";
          eventType = "organization_joined";
          title = "Toronto Food Recovery Network joined as organizational partner";
          description = "Toronto Food Recovery Network joined the network as a verified organization in Toronto, ON.";
          city = "Toronto";
          province = "ON";
          relatedListingId = null;
          relatedChapterId = null;
          timestamp = 1716800000000000000;
        },
      ];
      for (evt in seedEvents.values()) {
        activities.add(evt);
      };
    };
  };

  include MembersApi(members, volunteers, state, adminPrincipals, activities);
  include TrustApi(members, votes, adminPrincipals, activities);
  include ActivityApi(activities);
  include MembershipApi(membershipIntents);
  include OpportunitiesApi(opportunities, opportunityState, adminPrincipals);
};
