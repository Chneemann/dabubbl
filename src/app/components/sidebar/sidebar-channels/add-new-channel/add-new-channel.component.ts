import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChannelService } from '../../../../service/channel.service';
import { SmallBtnComponent } from '../../../../shared/components/buttons/small-btn/small-btn.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../interface/user.interface';
import { Channel } from '../../../../interface/channel.interface';
import { Router } from '@angular/router';
import { SharedService } from '../../../../service/shared.service';
import { ToggleBooleanService } from '../../../../service/toggle-boolean.service';
import { TranslateModule } from '@ngx-translate/core';
import { BtnLargeComponent } from '../../../../shared/components/buttons/btn-large/btn-large.component';

@Component({
  selector: 'app-add-new-channel',
  standalone: true,
  imports: [
    CommonModule,
    SmallBtnComponent,
    BtnLargeComponent,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './add-new-channel.component.html',
  styleUrl: './add-new-channel.component.scss',
})
export class AddNewChannelComponent {
  @Input() viewWidth: number = 0;

  currentDate: string = new Date().toISOString().split('T')[0];
  changeImg: boolean = false;
  userName: string = '';
  showExistedUsers: boolean = false;
  getSearchedUser: User[] = [];
  channelName: string = '';
  channelDescription: string = '';
  privatChannel: boolean = false;
  getSelectedUsers: User[] = [];
  selectedUsers: string[] = [];
  testarray: string[] = [];
  channelIsPrivat: boolean = false;
  showNextWindow: boolean = false;
  showNextWindowMobile: boolean = false;

  constructor(
    public channelService: ChannelService,
    public userService: UserService,
    public route: Router,
    private sharedService: SharedService,
    private toggleBooleanService: ToggleBooleanService
  ) {}

  RESPONSIVE_THRESHOLD_MOBILE = this.sharedService.RESPONSIVE_THRESHOLD_MOBILE;

  /**
   * Toggles the visibility of the add channel box.
   */
  toggleShowAddChannelBox() {
    this.channelService.showAddChannelBox =
      !this.channelService.showAddChannelBox;
    this.showNextWindow = false;
    this.showNextWindowMobile = false;
    this.channelName = '';
    this.channelDescription = '';
  }

  /**
   * Toggles the visibility of the next window.
   */
  createNewChannel() {
    if (this.viewWidth <= this.RESPONSIVE_THRESHOLD_MOBILE) {
      this.showNextWindowMobile = true;
    } else {
      this.showNextWindow = true;
    }
  }

  /**
   * Toggles the button to true.
   */
  toggleBtnTrue() {
    this.changeImg = true;
    this.channelIsPrivat = true;
  }

  /**
   * Toggles the button to false.
   */
  toggleBtnFalse() {
    this.changeImg = false;
    this.channelIsPrivat = false;
  }

  /**
   * Filters users based on input.
   * @param userName The name of the user to filter.
   */
  filterUsers(userName: string) {
    this.showExistedUsers = true;
    this.getSearchedUser = [];
    const searchedUser = userName.toLowerCase().trim();
    const filteredUsers = this.userService.getUsers().filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(searchedUser) &&
        user.id !== this.userService.getCurrentUserId()
      );
    });
    this.getSearchedUser.push(...filteredUsers);
  }

  /**
   * Chooses a user.
   * @param user The user to choose.
   */
  chooseUser(user: User) {
    const isUserAlreadySelected = this.getSelectedUsers.some(
      (selectedUser) => selectedUser.id === user.id
    );

    if (!isUserAlreadySelected) {
      this.selectedUsers.push(user.id!);
      this.getSelectedUsers.push(user);
      console.log('this.selectedUsers', this.selectedUsers);
    } else {
      console.log('User already selected!');
    }
    this.userName = '';
    this.showExistedUsers = false;
  }

  /**
   * Removes the current user.
   * @param index The index of the user to remove.
   */
  spliceCurrentUser(index: number) {
    this.getSelectedUsers.splice(index, 1);
    this.showExistedUsers = false;
  }

  /**
   * Toggles the added user box.
   */
  toggleAddedUserBox() {
    this.showExistedUsers = false;
  }

  /**
   * Checks if the channel name is valid.
   * @param channelName The name of the channel to check.
   */
  checkIfChannelNameIsValid(channelName: string) {
    const channelNameLength = channelName.length;
    if (channelNameLength >= 6 && !this.checkIfChannelExist(channelName)) {
      this.channelService.btnIsValid = true;
    } else {
      this.channelService.btnIsValid = false;
    }
  }

  /**
   * Check if channel is already existing.
   * @param channelName
   * @returns
   */
  checkIfChannelExist(channelName: string) {
    const filterChannel = this.channelService.allChannels.some(
      (channel) => channel.name === channelName
    );
    if (filterChannel) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Adds a new channel.
   */
  async addNewChannel() {
    const newChannel: Channel = {
      name: this.channelName,
      description: this.channelDescription || '',
      creator: this.userService.getCurrentUserId(),
      privatChannel: this.privatChannel,
      hashtag: this.channelName,
      createdDate: this.currentDate,
      addedUser: this.checkUserArray(),
      index: this.lastChannelIndex() + 1,
    };
    const channelId = await this.channelService.createNewChannel(
      newChannel,
      'channels'
    );
    this.openAddNewChannelWindow();
    if (this.viewWidth <= this.RESPONSIVE_THRESHOLD_MOBILE) {
      this.toggleBooleanService.isSidebarOpen = false;
    }
    this.route.navigateByUrl(`main/${channelId}`);
  }

  /**
   * Calculates the index of the last channel and returns the next available index.
   * @returns {number} The next available channel index.
   */
  lastChannelIndex(): number {
    const channels = this.channelService.allChannels.filter(
      (channel) => channel.index !== undefined && channel.index !== null
    );
    return Math.max(...channels.map((channel) => channel.index));
  }

  /**
   * Checks the user array.
   * @returns The user array.
   */
  checkUserArray() {
    if (this.channelIsPrivat) {
      return [...this.selectedUsers, this.userService.getCurrentUserId()];
    } else {
      return this.userService.getUserIDs;
    }
  }

  /**
   * Opens the add new channel window.
   */
  openAddNewChannelWindow() {
    this.channelService.showAddChannelBox =
      !this.channelService.showAddChannelBox;
    this.channelName = '';
    this.channelDescription = '';
    this.channelService.btnIsValid = false;
    this.getSelectedUsers = [];
    this.selectedUsers = [];
    this.showNextWindow = false;
    this.showNextWindowMobile = false;
  }
}
