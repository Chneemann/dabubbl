import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MainChatComponent } from '../main-chat/main-chat.component';
import { SecondaryChatComponent } from '../secondary-chat/secondary-chat.component';
import { ChatService } from '../../service/chat.service';
import { ChannelService } from '../../service/channel.service';
import { SidebarToggleComponent } from '../sidebar/sidebar-toggle/sidebar-toggle.component';
import { CommonModule } from '@angular/common';
import { AddNewChannelComponent } from '../sidebar/sidebar-channels/add-new-channel/add-new-channel.component';
import { OverlayComponent } from '../../shared/components/overlay/overlay.component';
import { ToggleBooleanService } from '../../service/toggle-boolean.service';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    MainChatComponent,
    SecondaryChatComponent,
    SidebarToggleComponent,
    CommonModule,
    AddNewChannelComponent,
    OverlayComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  constructor(
    public userService: UserService,
    public chatService: ChatService,
    public channelService: ChannelService,
    private router: Router,
    private route: ActivatedRoute,
    public toggleAllBooleans: ToggleBooleanService,
    private sharedService: SharedService
  ) {}

  currentChannel: string = '';
  viewWidth: number = 0;

  RESPONSIVE_THRESHOLD = this.sharedService.RESPONSIVE_THRESHOLD;
  RESPONSIVE_THRESHOLD_MAX = this.sharedService.RESPONSIVE_THRESHOLD_MAX;

  ngOnInit() {
    this.ifUserLogin();
    this.routeUserId();
    this.updateViewWidth();
  }

  /**
   * Checks if the user is logged in.
   */
  ifUserLogin() {
    if (this.userService.getCurrentUserId() === null) {
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 0);
    }
  }

  /**
   * Subscribes to route params and updates the current channel.
   */
  routeUserId() {
    if (this.route.params.subscribe()) {
      this.route.params.subscribe((params) => {
        this.currentChannel = params['id'];
      });
    }
  }

  /**
   * Listens for window resize events.
   */
  @HostListener('window:resize')
  onResize() {
    this.updateViewWidth();
  }

  /**
   * Updates the view width based on the current window width.
   */
  private updateViewWidth() {
    this.viewWidth = window.innerWidth;
    if (this.viewWidth <= this.RESPONSIVE_THRESHOLD) {
      this.toggleAllBooleans.isSidebarOpen = false;
    } else if (this.viewWidth >= this.RESPONSIVE_THRESHOLD) {
      this.toggleAllBooleans.isSidebarOpen = true;
    }
  }

  /**
   * Toggles various boolean values to control UI elements.
   */
  toggleBooleans() {
    this.toggleAllBooleans.openSearchWindow = false;
    this.toggleAllBooleans.openSearchWindowHead = false;
    this.toggleAllBooleans.selectUserInMsgBox = false;
  }
}
