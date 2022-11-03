import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { StateGroup } from './state-group';
declare var $: any;

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item) => item.toLowerCase().indexOf(filterValue) === 0);
};

export const getMousePos = (canvas: any, evt: any) => {
  console.log(canvas);
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  
  public imageUrl:string = '../assets/img/ดาวน์โหลด.jpg'
  public outputQuality:number = 0.8;
  stateForm: FormGroup = this._formBuilder.group({
    stateGroup: '',
  });

  stateGroups: StateGroup[] = [
    {
      letter: 'A',
      names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas'],
    },
    {
      letter: 'C',
      names: ['California', 'Colorado', 'Connecticut'],
    },
    {
      letter: 'D',
      names: ['Delaware'],
    },
    {
      letter: 'F',
      names: ['Florida'],
    },
    {
      letter: 'G',
      names: ['Georgia'],
    },
    {
      letter: 'H',
      names: ['Hawaii'],
    },
    {
      letter: 'I',
      names: ['Idaho', 'Illinois', 'Indiana', 'Iowa'],
    },
    {
      letter: 'K',
      names: ['Kansas', 'Kentucky'],
    },
    {
      letter: 'L',
      names: ['Louisiana'],
    },
    {
      letter: 'M',
      names: [
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
      ],
    },
    {
      letter: 'N',
      names: [
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
      ],
    },
    {
      letter: 'O',
      names: ['Ohio', 'Oklahoma', 'Oregon'],
    },
    {
      letter: 'P',
      names: ['Pennsylvania'],
    },
    {
      letter: 'R',
      names: ['Rhode Island'],
    },
    {
      letter: 'S',
      names: ['South Carolina', 'South Dakota'],
    },
    {
      letter: 'T',
      names: ['Tennessee', 'Texas'],
    },
    {
      letter: 'U',
      names: ['Utah'],
    },
    {
      letter: 'V',
      names: ['Vermont', 'Virginia'],
    },
    {
      letter: 'W',
      names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    },
  ];

  stateGroupOptions: Observable<StateGroup[]>[][] = [];

  items!: FormArray;
  rowsDataForm!: FormArray;

  masterRow = [
    {
      text:'xxxx',
      code:'yyyyy',
      name: 'ccccc',
      deladdress:[
        {
          city:'Alabama',
          texts:[
            {
              txt:'FFFFFFFF'
            },
            {
              txt:'JJJJJJJJ'
            }
          ]
        }
        ]
    },{
      text:'1111',
      code:'2222',
      name: '3333',
      deladdress:[
        {
          city:'Alabama',
          texts:[
            {
              txt:'FFFFFFFF'
            },
            {
              txt:'JJJJJJJJ'
            }
          ]
        }
        ]
    },{
      text:'1111',
      code:'2222',
      name: '3333',
      deladdress:[]
    }
  ]

  rowsForm = new FormGroup({
    rowDatas: new FormArray([])
  })

  get rowDatas() {
    return this.rowsForm.get('rowDatas') as FormArray;
  }

  data = [{
    "id": "1",
    "name": "Jen",
    "city": "Melbourne",
    "age": "65",
    isSelect:true
  }, {
    "id": "2",
    "name": "Roger",
    "city": "Melbourne",
    "age": "34",
    isSelect:false
  }, {
    "id": "3",
    "name": "Rob",
    "city": "Sydney",
    "age": "23",
    isSelect:false
  }, {
    "id": "4",
    "name": "George",
    "city": "Sydney",
    "age": "45",
    isSelect:false
  }, {
    "id": "5",
    "name": "Fred",
    "city": "Perth",
    "age": "23",
    isSelect:false
  }, {
    "id": "6",
    "name": "Kelly",
    "city": "Melbourne",
    "age": "23",
    isSelect:false
  }, {
    "id": "7",
    "name": "Gina",
    "city": "Perth",
    "age": "25",
    isSelect:false
  }];

  constructor(private _formBuilder: FormBuilder){
    
  }

  private createRows(){
    try {
      this.rowsDataForm = this.rowsForm.get('rowDatas') as FormArray;
      console.log(this.rowsDataForm);
      this.masterRow.forEach((row,i) => {
        const rowObj = new FormGroup({
          text: new FormControl(row.text),
          code: new FormControl(row.code),
          name: new FormControl(row.name),
          deladdress: new FormArray([]),
        });
        this.rowsDataForm.push(rowObj);
        let deladdress = this.rowsDataForm.at(i).get('deladdress') as FormArray;
        row.deladdress.forEach((_address,iAds) => {
          deladdress.push(this.Genrow(_address));
          this.ManageNameControl(i,iAds);
          _address.texts.forEach((txt:any,iTxt)=>{
          let text = deladdress.at(iAds).get('texts') as FormArray;
          text.push(this.GenTxt(txt))
          })
        });
      });
      console.log(this.rowsDataForm);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.createRows();
  }

  private _filterGroup(value: string) {
    if (value) {
      return this.stateGroups
        .map((group) => ({
          letter: group.letter,
          names: _filter(group.names, value),
        }))
        .filter((group) => group.names.length > 0);
    }

    return this.stateGroups;
  }


  Addnewrow(indexRow:number,) {
    this.rowsDataForm = this.rowsForm.get('rowDatas') as FormArray;
    let deladdress = this.rowsDataForm.at(indexRow).get('deladdress') as FormArray;
    deladdress.push(this.Genrow());
    this.ManageNameControl(indexRow,deladdress.length - 1);
  }

  ManageNameControl(indexRow: number,indexTd:number) {
    this.rowsDataForm = this.rowsForm.get('rowDatas') as FormArray;
    let deladdress = this.rowsDataForm.at(indexRow).get('deladdress') as FormArray;
    if (!this.stateGroupOptions[indexRow]) this.stateGroupOptions.push([])
    this.stateGroupOptions[indexRow][indexTd] = deladdress.at(indexTd).get('city')?.valueChanges.pipe(startWith(''),map(v=>this._filterGroup(v))) as Observable<StateGroup[]>
    console.log(this.stateGroupOptions);
  }

  Removeitem(index: any,it:number) {
    this.rowsDataForm = this.rowsForm.get('rowDatas') as FormArray;
    let deladdress = this.rowsDataForm.at(index).get('deladdress') as FormArray;
    deladdress.removeAt(it);
  }

   deladdress(index:number) {
    this.rowsDataForm = this.rowsForm.get('rowDatas') as FormArray;
    let deladdress = this.rowsDataForm.at(index).get('deladdress') as FormArray;
    return deladdress.controls
  }

  Genrow(address?:any): FormGroup {
    return new FormGroup({
      texts: new FormArray([]),
      street: new FormControl('', Validators.required),
      city: new FormControl(address?address.city:'', Validators.required),
      state: new FormControl('', Validators.required),
      zip: new FormControl('',Validators.compose([Validators.required, Validators.maxLength(6)])),
    });
  }

  GenTxt(txt?:any):FormGroup {
    return new FormGroup({
      txt:new FormControl(''),
    })
  }

  onClickBtn(){
    let arr = [
      {
        name:'a',
        last:'aa'
      },
      {
        name:'b',
        last:'ba'
      },
      {
        name:'c',
        last:'ca'
      }
    ]
    // console.log(arr);
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      console.log('index'+index,element);
    }
    
  }


}

