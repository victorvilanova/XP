<footer class="d-none d-md-block">
    <!-- A grey container -->
    <div class="greycontainer">
        <!-- A black container -->
        <div class="blackcontainer">
            <!-- Container to indent the content -->
            <div class="container">
                <div class="copyRightInfo d-flex flex-column-reverse flex-md-row d-md-flex justify-content-md-between py-3">
                    <div class="d-flex align-items-center">
                        <p class="mb-0">&copy; {{date('Y')}} {{getSetting('site.name')}}. {{__('All rights reserved.')}}</p>
                    </div>
                    <div class="d-flex align-items-center">
                        <ul class="d-flex flex-row nav mb-0 footer-social-links">
                            @if(getSetting('social.facebook_url'))
                                <li class="nav-item">
                                    <a class="nav-link pe-1 ml-2" href="{{getSetting('social.facebook_url')}}" target="_blank">
                                        @include('elements.icon',['icon'=>'logo-facebook','variant'=>'medium','classes' => 'text-lg opacity-8'])
                                    </a>
                                </li>
                            @endif
                            @if(getSetting('social.twitter_url'))
                                <li class="nav-item">
                                    <a class="nav-link pe-1 ml-2" href="{{getSetting('social.twitter_url')}}" target="_blank">
                                        @include('elements.icon',['icon'=>'logo-twitter','variant'=>'medium','classes' => 'text-lg opacity-8'])
                                    </a>
                                </li>
                            @endif
                            @if(getSetting('social.instagram_url'))
                                <li class="nav-item">
                                    <a class="nav-link pe-1 ml-2" href="{{getSetting('social.instagram_url')}}" target="_blank">
                                        @include('elements.icon',['icon'=>'logo-instagram','variant'=>'medium','classes' => 'text-lg opacity-8'])
                                    </a>
                                </li>
                            @endif
                            @if(getSetting('social.whatsapp_url'))
                                <li class="nav-item">
                                    <a class="nav-link pe-1 ml-2" href="{{getSetting('social.whatsapp_url')}}" target="_blank">
                                        @include('elements.icon',['icon'=>'logo-whatsapp','variant'=>'medium','classes' => 'text-lg opacity-8'])
                                    </a>
                                </li>
                            @endif
                            @if(getSetting('social.tiktok_url'))
                                <li class="nav-item">
                                    <a class="nav-link pe-1 ml-2" href="{{getSetting('social.tiktok_url')}}" target="_blank">
                                        @include('elements.icon',['icon'=>'logo-tiktok','variant'=>'medium','classes' => 'text-lg opacity-8'])
                                    </a>
                                </li>
                            @endif
                            @if(getSetting('social.youtube_url'))
                                <li class="nav-item">
                                    <a class="nav-link pe-1 ml-2" href="{{getSetting('social.youtube_url')}}" target="_blank">
                                        @include('elements.icon',['icon'=>'logo-youtube','variant'=>'medium','classes' => 'text-lg opacity-8'])
                                    </a>
                                </li>
                            @endif
                            @if(getSetting('social.telegram_link'))
                                <li class="nav-item">
                                    <a class="nav-link pe-1 ml-2" href="{{getSetting('social.telegram_link')}}" target="_blank">
                                        @include('elements.icon',['icon'=>'paper-plane','variant'=>'medium','classes' => 'text-lg opacity-8'])
                                    </a>
                                </li>
                            @endif
                        </ul>



                    </div>

                </div>
            </div>
        </div>
    </div>
</footer>
