// Fire-and-forget email notification helpers for Project Meadow
import Email "mo:caffeineai-email/emailClient";

module {

  /// Warm welcome email after membership interest is submitted.
  /// Fire-and-forget — failures are silent and never block the caller.
  public func sendMembershipWelcome(to : Text, name : Text, city : Text) : async () {
    try {
      ignore await Email.sendServiceEmail(
        "noreply",
        [to],
        "Welcome to Project Meadow",
        "<p>Hi " # name # ",</p>"
          # "<p>Thank you for your interest in joining Project Meadow.</p>"
          # "<p>We are building community coordination infrastructure across Canada — connecting local businesses, "
          # "food producers, trades, and community members to strengthen local economic resilience together.</p>"
          # "<p>Your interest from " # city # " means a lot to us. "
          # "Someone from our community may follow up with you in the coming days. "
          # "In the meantime, feel free to explore the network and share it with others in your community.</p>"
          # "<p>This is not an investment, subscription, or financial commitment of any kind — "
          # "simply a way to support community-driven coordination.</p>"
          # "<p>Thank you for being part of building something meaningful locally.</p>"
          # "<p>Warm regards,<br>The Project Meadow Team<br>projectmeadow.com</p>",
      );
    } catch (_) {};
  };

  /// Confirmation email after a volunteer form is submitted.
  /// Fire-and-forget — failures are silent and never block the caller.
  public func sendVolunteerConfirmation(to : Text, name : Text, city : Text) : async () {
    try {
      ignore await Email.sendServiceEmail(
        "noreply",
        [to],
        "Thank you for volunteering with Project Meadow",
        "<p>Hi " # name # ",</p>"
          # "<p>We are genuinely grateful you have offered your time to help build Project Meadow in " # city # ".</p>"
          # "<p>Volunteers are the backbone of local community coordination. "
          # "As local chapters grow, your participation will help onboard new members, "
          # "run community events, and connect producers and businesses with the people who need them most.</p>"
          # "<p>We will reach out as your local chapter develops and opportunities to participate arise. "
          # "In the meantime, tell a local business or neighbour about Project Meadow — "
          # "every connection strengthens the network.</p>"
          # "<p>Thank you for showing up for your community.</p>"
          # "<p>Warm regards,<br>The Project Meadow Team<br>projectmeadow.com</p>",
      );
    } catch (_) {};
  };

  /// Notification email once a member profile becomes active.
  /// Fire-and-forget — failures are silent and never block the caller.
  public func sendMemberProfileActive(to : Text, name : Text, city : Text) : async () {
    try {
      ignore await Email.sendServiceEmail(
        "noreply",
        [to],
        "Your Project Meadow profile is now active",
        "<p>Hi " # name # ",</p>"
          # "<p>Your Project Meadow profile is now live and visible to the community in " # city # ".</p>"
          # "<p>A few things you can do next:</p>"
          # "<ul>"
          # "<li>Complete your profile with a description, payment preferences, and contact details</li>"
          # "<li>Share your listing link with local customers, neighbours, or community groups</li>"
          # "<li>Explore other local businesses and producers near you</li>"
          # "</ul>"
          # "<p>Project Meadow is built on trust and participation. "
          # "The more you engage and share, the stronger your local network becomes.</p>"
          # "<p>Thank you for being part of the community.</p>"
          # "<p>Warm regards,<br>The Project Meadow Team<br>projectmeadow.com</p>",
      );
    } catch (_) {};
  };

  /// Internal admin notification for platform events.
  /// Fire-and-forget — failures are silent and never block the caller.
  public func sendAdminNotification(eventType : Text, name : Text, email : Text, city : Text) : async () {
    try {
      ignore await Email.sendServiceEmail(
        "noreply",
        ["admin@projectmeadow.com"],
        "New " # eventType # " on Project Meadow",
        "<p>A new " # eventType # " has been submitted.</p>"
          # "<p><strong>Name:</strong> " # name # "<br>"
          # "<strong>Email:</strong> " # email # "<br>"
          # "<strong>City:</strong> " # city # "</p>"
          # "<p>Log in to the admin panel at projectmeadow.com to review and follow up.</p>",
      );
    } catch (_) {};
  };

}
