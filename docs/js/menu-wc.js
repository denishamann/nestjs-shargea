'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nestjs-shargea documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-9e61111cf4c97bbe8c01ce5030ac4f79"' : 'data-target="#xs-controllers-links-module-AuthModule-9e61111cf4c97bbe8c01ce5030ac4f79"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-9e61111cf4c97bbe8c01ce5030ac4f79"' :
                                            'id="xs-controllers-links-module-AuthModule-9e61111cf4c97bbe8c01ce5030ac4f79"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-9e61111cf4c97bbe8c01ce5030ac4f79"' : 'data-target="#xs-injectables-links-module-AuthModule-9e61111cf4c97bbe8c01ce5030ac4f79"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-9e61111cf4c97bbe8c01ce5030ac4f79"' :
                                        'id="xs-injectables-links-module-AuthModule-9e61111cf4c97bbe8c01ce5030ac4f79"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CategoriesModule.html" data-type="entity-link">CategoriesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CategoriesModule-1866efaf9c19f22b5b881632e46a7e09"' : 'data-target="#xs-controllers-links-module-CategoriesModule-1866efaf9c19f22b5b881632e46a7e09"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CategoriesModule-1866efaf9c19f22b5b881632e46a7e09"' :
                                            'id="xs-controllers-links-module-CategoriesModule-1866efaf9c19f22b5b881632e46a7e09"' }>
                                            <li class="link">
                                                <a href="controllers/CategoriesController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CategoriesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CategoriesModule-1866efaf9c19f22b5b881632e46a7e09"' : 'data-target="#xs-injectables-links-module-CategoriesModule-1866efaf9c19f22b5b881632e46a7e09"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CategoriesModule-1866efaf9c19f22b5b881632e46a7e09"' :
                                        'id="xs-injectables-links-module-CategoriesModule-1866efaf9c19f22b5b881632e46a7e09"' }>
                                        <li class="link">
                                            <a href="injectables/CategoriesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CategoriesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EntriesModule.html" data-type="entity-link">EntriesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-EntriesModule-266d4f1d48c4f69dde56627c54908ddd"' : 'data-target="#xs-controllers-links-module-EntriesModule-266d4f1d48c4f69dde56627c54908ddd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EntriesModule-266d4f1d48c4f69dde56627c54908ddd"' :
                                            'id="xs-controllers-links-module-EntriesModule-266d4f1d48c4f69dde56627c54908ddd"' }>
                                            <li class="link">
                                                <a href="controllers/EntriesController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EntriesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EntriesModule-266d4f1d48c4f69dde56627c54908ddd"' : 'data-target="#xs-injectables-links-module-EntriesModule-266d4f1d48c4f69dde56627c54908ddd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EntriesModule-266d4f1d48c4f69dde56627c54908ddd"' :
                                        'id="xs-injectables-links-module-EntriesModule-266d4f1d48c4f69dde56627c54908ddd"' }>
                                        <li class="link">
                                            <a href="injectables/EntriesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>EntriesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MediaModule.html" data-type="entity-link">MediaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-MediaModule-88e9234e8018de915e10ae1a72825a12"' : 'data-target="#xs-controllers-links-module-MediaModule-88e9234e8018de915e10ae1a72825a12"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MediaModule-88e9234e8018de915e10ae1a72825a12"' :
                                            'id="xs-controllers-links-module-MediaModule-88e9234e8018de915e10ae1a72825a12"' }>
                                            <li class="link">
                                                <a href="controllers/MediaController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MediaController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MediaModule-88e9234e8018de915e10ae1a72825a12"' : 'data-target="#xs-injectables-links-module-MediaModule-88e9234e8018de915e10ae1a72825a12"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MediaModule-88e9234e8018de915e10ae1a72825a12"' :
                                        'id="xs-injectables-links-module-MediaModule-88e9234e8018de915e10ae1a72825a12"' }>
                                        <li class="link">
                                            <a href="injectables/MediaService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MediaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link">UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-7503ffd7892fd901769f9e8d383c2aa9"' : 'data-target="#xs-controllers-links-module-UsersModule-7503ffd7892fd901769f9e8d383c2aa9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-7503ffd7892fd901769f9e8d383c2aa9"' :
                                            'id="xs-controllers-links-module-UsersModule-7503ffd7892fd901769f9e8d383c2aa9"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-7503ffd7892fd901769f9e8d383c2aa9"' : 'data-target="#xs-injectables-links-module-UsersModule-7503ffd7892fd901769f9e8d383c2aa9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-7503ffd7892fd901769f9e8d383c2aa9"' :
                                        'id="xs-injectables-links-module-UsersModule-7503ffd7892fd901769f9e8d383c2aa9"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuthCredentialsDto.html" data-type="entity-link">AuthCredentialsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Category.html" data-type="entity-link">Category</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryRepository.html" data-type="entity-link">CategoryRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCategoryDto.html" data-type="entity-link">CreateCategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEntryDto.html" data-type="entity-link">CreateEntryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateMediaDto.html" data-type="entity-link">CreateMediaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Entry.html" data-type="entity-link">Entry</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryRepository.html" data-type="entity-link">EntryRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCategoriesFilterDto.html" data-type="entity-link">GetCategoriesFilterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetEntriesFilterDto.html" data-type="entity-link">GetEntriesFilterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Media.html" data-type="entity-link">Media</a>
                            </li>
                            <li class="link">
                                <a href="classes/MediaRepository.html" data-type="entity-link">MediaRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCategoryDto.html" data-type="entity-link">UpdateCategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEntryDto.html" data-type="entity-link">UpdateEntryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateMediaDto.html" data-type="entity-link">UpdateMediaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link">UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRepository.html" data-type="entity-link">UserRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerificationTokenEntity.html" data-type="entity-link">VerificationTokenEntity</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link">JwtPayload</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});