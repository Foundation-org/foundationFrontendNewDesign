export const toastMessages = {
  error: '',
  verificationEmailSent: 'A verification email has been sent to your email address. Please check your inbox.',
  passwordMismatched: 'Passwords do not match. Please make sure your new password and retype password match.',
  wrongPassword: 'Wrong Password',
  referalVerified: 'Referral code verified',
  referalInvalid: 'Referral code is not valid.',
  generalError: 'An error occurred',
  otpSent: 'OTP sent Successfully',
  otpVerified: 'OTP verified Successfully',
  otpEmptyBlock: 'You cannot leave a block blank',
  otpExpired: 'OTP expired',
  badgeAdded: 'Badge Added Successfully!',
  badgeRemoval: 'Badge Removed Successfully!',
  badgeUpdated: 'Badge Updated Successfully!',
  errorAddingBadge: 'An error occurred while adding badge',
  newList: 'New list created.',
  listAlreadyExists: 'List with a similar name already exists.',
  postAddedtoList: 'Post added in a list.',
  postAlreadyinList: 'Post already added in a list.',
  emailNotificationClosed: 'Email notification closed successfully',
  emptyEmail: 'Email cannot be empty.',
  deleteHistory: 'History Removed Successfully',
  emptyCodeToDelete: 'Enter some code to Delete',
  deleteList: 'List deleted successfully',
  deletePost: 'Post deleted successfully',
  listNameUpdate: 'List name updated successfully',
  blankField: 'You cannot leave the field blank !',
  degreeWordsLimit: 'Degree cannot be less than three words',
  graduationDateSameStart: 'Please ensure the graduation date is not the same as the start date.',
  graduationDateEarlierStart: 'Please ensure the graduation date is not earlier than the start date.',
  DateSameStart: 'Please ensure the ending date is not same as the starting date..',
  DateEarlierStart: 'Please ensure the ending date is not earlier than the starting date.',
  schoolAlreadyExist: 'School already exists',
  infoAlreadySaved: 'Information already saved',
  infoUpdated: 'Info Updated Successfully',
  emptyUrl: 'Url cannot be empty',
  failedGettingLocation:
    'It seems like location services are off or denied. To proceed, please enable location in your device settings and try again.',
  locationNotSupported: "Your browser doesn't support geolocation.",
  selectSecQuestion: 'Please select a question first!',
  emptyAnswer: 'Answer field cannot be empty.',
  linkCreated: 'Link created successfully',
  emptyLink: 'Link cannot be empty',
  linkAlready: 'Link already created',
  copyLink: 'Link Copied!',
  postHidden: 'Post hidden successfully',
  hidingOwnPost: 'You cannot give feedback or hide your own post.',
  hiddenReason: 'You must select a reason before submitting.',
  postUnhidden: 'Post unhidden successfully',
  paymentSuccessful: 'Payment succeeded!',
  paymentUnsuccessful: 'Your payment was not successful, please try again.',
  somethingWrong: 'Oops! Something Went Wrong.',
  unexpectedError: 'An unexpected error occurred.',
  AdultPost: 'Sharing adult posts is prohibited.',
  customLinkGenerated: 'Custom link generated successfully.',
  emptyOption: 'Option cannot be empty',
  emailType: 'Please select the email type!',
  supportRequest: 'Support request received!',
  orderUpdated: 'Order updated successfully',
  verifyEmail: 'Please check your Email to verify',
  featureComingSoon: 'Feature coming soon.',
  switchDesktop: 'Please switch to desktop!',
  switchMobile: 'Please switch to mobile!',
  youtubePlaylistNot: 'We do not support YouTube playlists',
  soundCloudPlaylistNot: 'We do not support SoundCloud playlists',
  youtubeSoundCloudLinks: 'YouTube and SoundCloud links are supported.',
  youtubeLinks: 'YouTube links are supported.',
  soundCloudLinks: 'SoundCloud links are supported.',
  invalidUrl: 'Invalid Url',
  emptyPost: 'Post cannot be empty',
  emptyPostDescription: 'You cannot leave the description empty.',
  optionLimit: 'You cannot add more than 50 options',
  minOptionLimitRanked: 'The minimum number of options should be 3.',
  selectedSameOptions: 'You have selected the same option as last time. Your option was not changed.',
  changeOptionTimePeriod: 'You can change your option once every 1 hour.',
  emptySelection: `Oops! You haven't selected anything yet.`,
  optionBlank: 'You cannot leave the added option blank',
  redemptionCreated: 'Redemption Code created successfully',
  redeemAdd: 'Hit add to redeem',
  redemptionSuccessful: 'Code Redeemed Successfully',
  enterCode: 'Enter some code to Redeem',
  selectAmount: 'Please select the amount',
  shareLinkCopied: 'Share Link copied!',
  codeCopied: 'Code Copied!',
  minAmount: 'Minimum amount is 2.5$',
  paymentMethod: 'Select a payment method',
  recapta: 'Please complete the reCAPTCHA challenge before proceeding.',
  incorrectTypedPassword: 'Your typed password is incorrect.',
  userNotFound: 'Oops! User not found',
  verifyCode: 'Please Open the verification Page from the email',
  termsAndConditions: 'Please accept the terms and conditions to continue!',
  emailVerified: 'Email verified successfully.',
  emptyPostList: 'You cannot save without selecting a list!',
  recaptaFailed: 'Google recaptcha failed',
  emptyList: 'List name can not be empty',
  webViewLogin:
    'This web view within your application is not secure. To sign in, please copy and paste the link into Chrome, Safari or your stand alone browser of choice.',
  webViewSignUp:
    'This web view within your application is not secure. To create an account, please copy and paste the link into Chrome, Safari or your stand alone browser of choice.',
  youAreViewingPreview: 'You are viewing a preview',
  hideOption: 'Option hidden successfully',
  hideOptionDeleted: 'Option deleted successfully',
  analyzeParticipatedPost: "Please participate in the post first",
  cantHideLastTwoOptions: 'You cannot hide the last two options',
  deleteAllAnalytics: 'Advance analytics cleared successfully',
  activityAlreadyExists: 'Activity already exists',
  analyticOrderChanged: 'Order changed Successfully',
} as const;
