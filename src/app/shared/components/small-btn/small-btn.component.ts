import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-small-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './small-btn.component.html',
  styleUrl: './small-btn.component.scss',
})
export class SmallBtnComponent {
  @Input() imgSrc: string = '';
  @Input() imgSize: string = '14px';
  @Input() imgFilter: string =
    'brightness(0) saturate(100%) invert(33%) sepia(23%) saturate(5211%) hue-rotate(224deg) brightness(96%) contrast(97%)';
  @Input() imgFilterStatic: string =
    'brightness(0) saturate(100%) invert(0%) sepia(5%) saturate(7481%) hue-rotate(228deg) brightness(98%) contrast(106%)';
  @Input() btnSize: string = '28px';
  @Input() btnBgColor: string = '';
  @Input() btnBgHoverColor: string = '#edeefe';
  @Input() disable: boolean = false;
}
