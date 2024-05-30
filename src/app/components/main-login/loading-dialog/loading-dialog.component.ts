import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { loginService } from '../../../service/login.service';

@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './loading-dialog.component.html',
  styleUrl: './loading-dialog.component.scss',
})
export class LoadingDialogComponent {
  constructor(public loginService: loginService) {}
}
