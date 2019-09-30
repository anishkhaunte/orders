

function assertBehavior( behavior, currentStatus,...expectedStatuses) {
  if (expectedStatuses.includes(currentStatus)) {
    throw new InvalidBehaviorForStateError(behavior, {
      currentStatus,
      expectedStatuses,
    });
  }
}