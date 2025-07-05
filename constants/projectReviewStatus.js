// ---- Project Review Status Constants ----
export const PROJECT_REVIEW_STATUS = {
    UNDER_REVIEW: "under_review",
    REVIEWED: "reviewed",
    APPROVED: "approved",
    VERIFIED: "verified",
    PLATFORM_PROJECT: "platform_project",
    REJECTED: "rejected",
    POTENTIAL_RISK: "potential_risk",
    DYOR: "dyor",
    UNCERTAIN: "uncertain",
    FLAGGED: "flagged",
    INACTIVE: "inactive",
    RESTRICTED: "restricted"
};

// ---- Display Text Mappings ----
export const PROJECT_REVIEW_STATUS_DISPLAY = {
    [PROJECT_REVIEW_STATUS.UNDER_REVIEW]: "Under Review",
    [PROJECT_REVIEW_STATUS.REVIEWED]: "Reviewed",
    [PROJECT_REVIEW_STATUS.APPROVED]: "Approved",
    [PROJECT_REVIEW_STATUS.VERIFIED]: "Verified ",
    [PROJECT_REVIEW_STATUS.PLATFORM_PROJECT]: "Platform Project ",
    [PROJECT_REVIEW_STATUS.REJECTED]: "Rejected",
    [PROJECT_REVIEW_STATUS.POTENTIAL_RISK]: "Potential Risk ",
    [PROJECT_REVIEW_STATUS.DYOR]: "DYOR ",
    [PROJECT_REVIEW_STATUS.UNCERTAIN]: "Status Uncertain",
    [PROJECT_REVIEW_STATUS.FLAGGED]: "Flagged ",
    [PROJECT_REVIEW_STATUS.INACTIVE]: "Inactive",
    [PROJECT_REVIEW_STATUS.RESTRICTED]: "Restricted"
};

// ---- Status Color Classes ----
export const PROJECT_REVIEW_STATUS_COLOR = {
    [PROJECT_REVIEW_STATUS.UNDER_REVIEW]: "text-info",
    [PROJECT_REVIEW_STATUS.REVIEWED]: "text-primary",
    [PROJECT_REVIEW_STATUS.APPROVED]: "text-success",
    [PROJECT_REVIEW_STATUS.VERIFIED]: "text-success",
    [PROJECT_REVIEW_STATUS.PLATFORM_PROJECT]: "text-success",
    [PROJECT_REVIEW_STATUS.REJECTED]: "text-error",
    [PROJECT_REVIEW_STATUS.POTENTIAL_RISK]: "text-warning",
    [PROJECT_REVIEW_STATUS.DYOR]: "text-warning",
    [PROJECT_REVIEW_STATUS.UNCERTAIN]: "text-neutral",
    [PROJECT_REVIEW_STATUS.FLAGGED]: "text-warning",
    [PROJECT_REVIEW_STATUS.INACTIVE]: "text-neutral",
    [PROJECT_REVIEW_STATUS.RESTRICTED]: "text-error"
};
