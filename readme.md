## Crafty-app

Made by <a target="_blank" href="https://crafty-app.com"> Crafty-app</a>

# A Popup picker

A Popup item selector

## Installation

npm:

```bash
  npm i @khaledz370/popup-picker
```

yarn:

```bash
  yarn add @khaledz370/popup-picker
```

## Usage

List of possible values:

align:

```bash
    Change the title and the popuplist button flexDirection
    type enum 'column' | 'row' | 'row-reverse'| 'column-reverse'
    default "column"
```

title:

```bash
   Sets the title name
   type string
   default "Select"
```

data:

```bash
    An array of list values must be in [{text:'',value:''}] form
    type array
    default []
```

search:

```bash
   Enable search through data
   type boolean
   default false
```

value:

```bash
   set the selected value
   type string or number
   default null
```

titleColor:

```bash
  Change the color of the title
  type color
  default "black"
```

selectedColor

```bash
  Change the color of the button
  type color
  default "black"
```

titleAlign

```bash
  Set title align
  type enum 'center' | 'left' | 'right'
  default "center"
```

fontSize:

```bash
  change font size for the title and list and button
  type number
  default 18
```

onSelect:

```bash
  returns the value and the text
```

## Usage/Examples

### Slider basic example

```javascript
import PopupPicker from "@khaledz370/popup-picker";

const data = [
  {text:"text1",value:"value1"}
  {text:"text2",value:"value1"}
  {text:"text3",value:"value3"}
  ]

export default function App() {
  const [value, setValue] = useState('value2');
  const [text, setText] = useState('text2');
  return (
    <PopupPicker
      search={true}
      title={'values'}
      data={data}
      value={value}
      selectedColor="purple"
      titleColor="red"
      // you can use value and text
      onSelect={(value, text) => {
        setValue(value);
        setText(text);
      }}
      // or you can ignore text
      onSelect={value => {
        setValue(value);
      }}
    />
  );
}
```

## Screenshots

![alt text](https://raw.githubusercontent.com/kz370/myImages/main/popupPickerBtn.png)
![alt text](https://raw.githubusercontent.com/kz370/myImages/main/popupPicker.png)

## upcoming updates:

```bash
   Enable multi item selection
```
