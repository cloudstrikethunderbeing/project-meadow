// Domain logic helpers for the membership domain
import Time "mo:core/Time";
import MembershipTypes "../types/membership";

module {
  public type MembershipTier = MembershipTypes.MembershipTier;
  public type MembershipStatus = MembershipTypes.MembershipStatus;

  /// Generate a deterministic membership ID using Time.now() + a salt text
  public func generateMembershipId(salt : Text) : Text {
    let ts = Time.now();
    "mid-" # ts.toText() # "-" # salt;
  };

  /// Map tier to price in cents (CAD): $5=500, $10=1000, $25=2500, $20=2000, $0=0
  public func tierToPrice(tier : MembershipTier) : Nat {
    switch (tier) {
      case (#communitySupporterTier) 500;
      case (#builderMember)          1000;
      case (#localSponsor)           2500;
      case (#verifiedBusiness)       2000;
      case (#localProducer)          1000;
      case (#communityPartner)       0;
    };
  };

  /// Map tier to human-readable label
  public func tierToText(tier : MembershipTier) : Text {
    switch (tier) {
      case (#communitySupporterTier) "Community Supporter";
      case (#builderMember)          "Builder Member";
      case (#localSponsor)           "Local Sponsor";
      case (#verifiedBusiness)       "Verified Business Member";
      case (#localProducer)          "Local Producer Member";
      case (#communityPartner)       "Community Partner";
    };
  };

  /// Map status to human-readable label
  public func statusToText(status : MembershipStatus) : Text {
    switch (status) {
      case (#pending)   "Pending";
      case (#contacted) "Contacted";
      case (#approved)  "Approved";
    };
  };
}
