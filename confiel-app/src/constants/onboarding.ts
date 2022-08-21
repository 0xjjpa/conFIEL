export enum ONBOARDING_FLOW {
    'open_account' = 0,
    'open_account_requested' = 1,
    'account_approved' = 2
}

export const ONBOARDING_DEFAULT_STAGE = ONBOARDING_FLOW.open_account