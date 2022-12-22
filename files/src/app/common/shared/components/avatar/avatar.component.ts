import { Component, Input } from '@angular/core';

interface IColor {
  bg: string;
  text: string;
}

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() size: string = '40px';
  @Input() name: string;
  @Input() src: string | undefined;
  private _colors: IColor[] = [
    { bg: '#E57373', text: '#FFF' },
    { bg: '#F06292', text: '#FFF' },
    { bg: '#BA68C8', text: '#FFF' },
    { bg: '#9575CD', text: '#FFF' },
    { bg: '#7986CB', text: '#FFF' },
    { bg: '#64B5F6', text: '#FFF' },
    { bg: '#4DB6AC', text: '#FFF' },
    { bg: '#81C784', text: '#FFF' },
    { bg: '#FFCA28', text: '#FFF' }
  ];

  get initials(): string {
    return (
      this.name
        ?.replace(/(\w*)\s?(.*\s)(\w*)/gm, '$1 $3')
        .split(' ')
        .map((item: string): string => item[0]?.toUpperCase())
        .join('') ?? ''
    );
  }

  get color(): IColor | undefined {
    return this._colors[
      this.initials.split('').reduce((value: number, char: string): number => {
        value += char.codePointAt(0) ?? 0;
        return value;
      }, 0) % this._colors.length
    ];
  }

  get fontSize(): string {
    return `calc(${this.size} / 2)`;
  }
}
