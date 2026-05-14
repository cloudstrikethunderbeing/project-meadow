// Activity domain logic — stateless helper module
import List "mo:core/List";
import Int "mo:core/Int";
import Time "mo:core/Time";
import ActivityTypes "../types/activity";

module {
  public type ActivityEvent = ActivityTypes.ActivityEvent;

  /// Return up to `limit` most recent events from the list, sorted descending by timestamp.
  public func getActivityFeed(
    activities : List.List<ActivityEvent>,
    limit : Nat,
  ) : [ActivityEvent] {
    let arr = activities.toArray();
    let sorted = arr.sort(func(a : ActivityEvent, b : ActivityEvent) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp);
    });
    if (sorted.size() <= limit) {
      sorted;
    } else {
      sorted.sliceToArray(0, limit.toInt());
    };
  };

  /// Return up to `limit` most recent events for the given city, sorted descending by timestamp.
  public func getLocalActivity(
    activities : List.List<ActivityEvent>,
    city : Text,
    limit : Nat,
  ) : [ActivityEvent] {
    let cityLower = city.toLower();
    let filtered = activities.filter(func(e : ActivityEvent) : Bool {
      e.city.toLower() == cityLower;
    });
    let arr = filtered.toArray();
    let sorted = arr.sort(func(a : ActivityEvent, b : ActivityEvent) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp);
    });
    if (sorted.size() <= limit) {
      sorted;
    } else {
      sorted.sliceToArray(0, limit.toInt());
    };
  };

  /// Build and return a new ActivityEvent with the given fields and current timestamp.
  public func createEvent(
    eventType        : Text,
    title            : Text,
    description      : Text,
    city             : Text,
    province         : Text,
    relatedListingId : ?Text,
    relatedChapterId : ?Text,
  ) : ActivityEvent {
    let now = Time.now();
    {
      id               = "evt-" # now.toText();
      eventType;
      title;
      description;
      city;
      province;
      relatedListingId;
      relatedChapterId;
      timestamp        = now;
    };
  };
}
