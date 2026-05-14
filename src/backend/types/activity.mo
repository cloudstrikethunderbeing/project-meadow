// Activity domain types for Project Meadow
module {
  /// Supported activity event type values:
  /// "business_joined" | "producer_joined" | "trades_joined" | "organization_joined"
  /// | "volunteer_joined" | "listing_verified" | "chapter_created"
  /// | "event_created" | "affordability_program" | "producer_featured"
  public type ActivityEvent = {
    id : Text;
    eventType : Text;
    title : Text;
    description : Text;
    city : Text;
    province : Text;
    relatedListingId : ?Text;
    relatedChapterId : ?Text;
    timestamp : Int;
  };
}
