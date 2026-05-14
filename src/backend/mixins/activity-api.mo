// Activity API mixin — exposes public query endpoints for activity feed
import List "mo:core/List";
import ActivityTypes "../types/activity";
import ActivityLib "../lib/activity";

mixin (activities : List.List<ActivityTypes.ActivityEvent>) {
  /// Returns up to `limit` most recent activity events sorted descending by timestamp.
  public shared query func getActivityFeed(limit : Nat) : async [ActivityTypes.ActivityEvent] {
    ActivityLib.getActivityFeed(activities, limit);
  };

  /// Returns up to `limit` most recent activity events for a specific city, sorted descending by timestamp.
  public shared query func getLocalActivity(city : Text, limit : Nat) : async [ActivityTypes.ActivityEvent] {
    ActivityLib.getLocalActivity(activities, city, limit);
  };
}
