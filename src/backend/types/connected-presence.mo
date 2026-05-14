// Connected Presence domain types for Project Meadow
// Supports external website/blog/product linking and featured content on member profiles
module {
  /// All supported external link types — flexible for future expansion
  public type LinkType = {
    #website;
    #blog;
    #store;
    #booking;
    #donation;
    #events;
    #newsletter;
    #youtube;
    #instagram;
    #twitter;
    #facebook;
    #etsy;
    #shopify;
    #gumroad;
    #patreon;
    #substack;
    #calendly;
    #telegram;
    #discord;
    #signal;
    #linktree;
    #pdf;
    #other;
  };

  /// A single connected external link on a member profile
  public type ConnectedPresenceLink = {
    linkType : LinkType;
    url : Text;
    displayLabel : ?Text;
  };

  /// Optional featured content highlight on a member/listing profile
  /// featuredType examples: "article" | "product" | "event" | "workshop" | "initiative" | "fundraiser"
  public type FeaturedContent = {
    title : Text;
    description : Text;
    imageUrl : ?Text;
    externalLink : Text;
    featuredType : ?Text;
  };
}
