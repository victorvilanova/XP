<div class="profile-widgets-area pb-3">

    <div class="card recent-media rounded-lg">
        <div class="card-body m-0 pb-0">
        </div>
        <h5 class="card-title pl-3 mb-0 card-title text-uppercase fs-point-85 font-weight-bold">{{__('Recent')}}</h5>
        <div class="card-body {{$recentMedia ? 'text-center' : ''}}">
            @if($recentMedia && count($recentMedia) && Auth::check())
                @foreach($recentMedia as $media)
                    <a href="{{$media->path}}" rel="mswp" class="mr-1">
                        <img src="{{AttachmentHelper::getThumbnailPathForAttachmentByResolution($media, 150, 150)}}" class="rounded mb-2 mb-md-2 mb-lg-2 mb-xl-0 img-fluid">
                    </a>
                @endforeach
            @else
                <p class="m-0">{{__('Latest media not available.')}}</p>
            @endif

        </div>
    </div>

    @if($user->paid_profile && (!getSetting('profiles.allow_users_enabling_open_profiles') || (getSetting('profiles.allow_users_enabling_open_profiles') && !$user->open_profile)))
        @if(Auth::check())
            @if( !(isset($hasSub) && $hasSub) && !(isset($post) && PostsHelper::hasActiveSub(Auth::user()->id, $post->user->id)) && Auth::user()->id !== $user->id)
                <div class="card mt-3 rounded-lg">
                    <div class="card-body">
                        <h5 class="card-title text-uppercase fs-point-85 font-weight-bold">{{__('Subscription')}}</h5>
                        <button class="btn btn-round btn-outline-primary btn-block d-flex align-items-center justify-content-center justify-content-lg-between mt-3 mb-0 to-tooltip {{(Auth::check() && !GenericHelper::isEmailEnforcedAndValidated() || !GenericHelper::creatorCanEarnMoney($user)) ? 'disabled' : ''}}"
                                @if(!Auth::user()->email_verified_at && getSetting('site.enforce_email_validation'))
                                data-placement="top"
                                title="{{__('Please verify your account')}}"
                                @elseif(!GenericHelper::creatorCanEarnMoney($user))
                                data-placement="top"
                                title="{{__('This creator cannot earn money yet')}}"
                                @else
                                data-toggle="modal"
                                data-target="#checkout-center"
                                data-type="one-month-subscription"
                                data-recipient-id="{{$user->id}}"
                                data-amount="{{$user->profile_access_price}}"
                                data-first-name="{{Auth::user()->first_name}}"
                                data-last-name="{{Auth::user()->last_name}}"
                                data-billing-address="{{Auth::user()->billing_address}}"
                                data-country="{{Auth::user()->country}}"
                                data-city="{{Auth::user()->city}}"
                                data-state="{{Auth::user()->state}}"
                                data-postcode="{{Auth::user()->postcode}}"
                                data-available-credit="{{Auth::user()->wallet->total}}"
                                data-username="{{$user->username}}"
                                data-name="{{$user->name}}"
                                data-avatar="{{$user->avatar}}"
                            @endif
                        >
                            <span class="d-none d-md-block d-xl-block d-lg-block">{{__('Subscribe')}}</span>
                            <span class="d-none d-lg-block">{{\App\Providers\SettingsServiceProvider::getWebsiteFormattedAmount($user->profile_access_price)}} {{__('for')}} {{trans_choice('days',30,['number'=>30])}}</span>
                        </button>
                    </div>
                </div>
            @endif
        @else
            <div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">{{__('Subscription')}}</h5>
                    <button class="btn btn-round btn-outline-primary btn-block d-flex align-items-center justify-content-center justify-content-lg-between mt-3 mb-0"
                            data-toggle="modal"
                            data-target="#login-dialog"
                    >
                        <span class="d-none d-md-block d-xl-block d-lg-block">{{__('Subscribe')}}</span>
                        <span class="d-none d-lg-block">{{\App\Providers\SettingsServiceProvider::getWebsiteFormattedAmount($user->profile_access_price)}} {{__('for')}} {{trans_choice('days',30,['number'=>30])}}</span>
                    </button>
                </div>
            </div>
        @endif
    @elseif(!Auth::check() || (Auth::check() && Auth::user()->id !== $user->id))
        @if(Auth::check())
            <div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">{{__('Follow this creator')}}</h5>
                    <button class="btn btn-round btn-outline-primary btn-block mt-3 mb-0 manage-follow-button" onclick="Lists.manageFollowsAction('{{$user->id}}')">
                        <span class="manage-follows-text">{{\App\Providers\ListsHelperServiceProvider::getUserFollowingType($user->id, true)}}</span>
                    </button>
                </div>
            </div>
        @else
            <div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">{{__('Follow this creator')}}</h5>
                    <button class="btn btn-round btn-outline-primary btn-block mt-3 mb-0 text-center"
                            data-toggle="modal"
                            data-target="#login-dialog"
                    >
                        <span class="d-none d-md-block d-xl-block d-lg-block">{{__('Follow')}}</span>
                    </button>
                </div>
            </div>
        @endif
    @endif

    @if(getSetting('custom-code-ads.sidebar_ad_spot'))
        <div class="mt-3">
            {!! getSetting('custom-code-ads.sidebar_ad_spot') !!}
        </div>
    @endif

    @include('template.footer-feed')

</div>
