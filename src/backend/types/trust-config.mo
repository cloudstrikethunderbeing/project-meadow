// Configurable thresholds for community trust / verification logic
module {
  // Minimum positive confirmations required for Community Verified status
  public let MIN_UPVOTES : Nat = 3;

  // Maximum downvotes before a listing is placed Under Review
  public let MAX_DOWNVOTES_BEFORE_REVIEW : Nat = 2;

  // Minimum listing age in days before Community Verified can be awarded
  public let MIN_AGE_DAYS : Nat = 7;
}
