import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/shared/profile.service';
// import { MsalService } from '../../msal';
import { isIE, b2cPolicies } from '../../azure-config';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-toolbar',
  templateUrl: `./toolbar.component.html`,
  styles: [`
    .awb-btn{
      background-color: #0dcde9;
      padding: 0px 15px;
      white-space: nowrap;
      font-size: 16px;
      border-radius: 15px;
      font-size: 16px;
      margin-right:15px;
      height: 28px;
      line-height: 28px;
    }
    .social-icons{
      display:inline-block;
      margin-right:15px;
    }
    @media screen and (max-width: 959px){
      .mobile_menu{
        display: none;
      }
      .mobile_menu.show{
        z-index:2;
        display:flex;
        position: absolute;
        background: #bbdefb;
        max-height: 340px;
        height: auto;
        top: 100%;
        right: 0;
        left: 0;
        flex-direction: column;
        box-shadow: 0px 5px 4px -1px rgba(0, 0, 0, 0.2);
        color: #888;
      }
    }
    `]
})
export class ToolbarComponent implements OnInit, OnDestroy {
  langs = [
    { code: 'en', name: 'English' },
    { code: 'zh-cn', name: '简体中文' },
    { code: 'zh-hk', name: '繁體中文' },
  ];
  iscollapsed = true;

  constructor(private translate: TranslateService,
              public profile: ProfileService,
              private authService: MsalService) { }

  onLanguageChange(selectedLang: string): void {
    if (selectedLang) {
      this.translate.use(selectedLang);
      localStorage.setItem('language', selectedLang);
    }
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.profile.clear();
  }

  get isLoggedIn(): boolean {
    return this.profile.isLoggedIn;
  }

  login(): void {
    this.authService.loginRedirect();
  }

  logout(): void {
    this.profile.clear();
    this.profile.logout();
    // this.authService.logout();
  }

  resetPassword(): void {
    if (isIE) {
      this.authService.loginRedirect(b2cPolicies.authorities.resetPassword);
    } else {
      this.authService.loginPopup(b2cPolicies.authorities.resetPassword);
    }
  }

  editProfile(): void {
    // if (isIE) {
    //   this.authService.loginRedirect(b2cPolicies.authorities.editProfile);
    // } else {
    //   this.authService.loginPopup(b2cPolicies.authorities.editProfile);
    // }
  }

  get isAdmin(): boolean {
    return this.profile.isAdmin;
  }

  get isSuper(): boolean {
    return this.profile.isSuper;
  }
}
