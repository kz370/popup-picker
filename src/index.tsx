import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, FlatList, Animated, TextInput, Pressable, TouchableOpacity } from 'react-native';
import s from './Styles'

const getIndex = (array, value, valueExtractor, textExtractor) => {
    let i, index = 0
    for (i = 0; i < array.length; i++) {
        if (`${value}` === `${array[i][valueExtractor]}` || `${value}` === `${array[i][textExtractor]}`) {
            index = i
        }
    }
    return index
}

const getMultipleIndexes = (array, values, valueExtractor, textExtractor) => {
    let i, j, newArray = []
    for (i = 0; i < values.length; i++) {
        for (j = 0; j < array.length; j++) {
            if (`${values[i]}` === `${array[j][valueExtractor]}` || `${values[i]}` === `${array[j][textExtractor]}`) {
                newArray.push(j)
            }
        }
    }
    return newArray
}

interface RequiredProps {
    /** required! 
     * returns (value,text) when pressed text value is not essential */
    onSelect: (value: string | number, text: string) => void
    /** required! when multiple
     * returns array when pressed text value is not essential */
    onConfirm: (array: Array<any>) => void
}

interface OptionalProps {
    /** Change the title and the popuplist button flexDirection */
    align?: 'column' | 'row' | 'row-reverse' | 'column-reverse',
    /** Sets the title name*/
    title?: string;
    /** An array of list values must be in [{text:'',value:''}] form */
    data?: Array<object>;
    /** Enable search through data  */
    search?: boolean
    /** set the selected value */
    value?: string | number | null
    /** Change the color of the title */
    titleColor?: string
    /** Change the color of the button */
    selectedColor?: string
    /** Set title align */
    titleAlign?: 'center' | 'left' | 'right'
    /** change font size for the title and list and button */
    fontSize?: number
    /** replace value key with a custom one */
    valueExtractor?: string
    /** replace text key with a custom one */
    textExtractor?: string
    /** enables multiple seletion */
    multiSelect?: boolean
    /** set the selected values */
    values?: Array<object>
    /** toggle showing multiple selected items */
    showValues?: boolean,
    /** checkBox style */
    checkBoxStyle?: object,
}

const defaultProps: OptionalProps = {
    align: "column",
    title: "Select",
    data: [],
    search: false,
    value: null,
    titleColor: 'black',
    selectedColor: 'black',
    titleAlign: 'center',
    fontSize: 18,
    valueExtractor: 'value',
    textExtractor: 'text',
    multiSelect: false,
    values: [],
    showValues: true,
    checkBoxStyle: {},
}

interface AllProps extends OptionalProps, RequiredProps { }

const PopupPicker = (props: AllProps) => {
    try {
        const zoom = useRef(new Animated.Value(0)).current;
        const [showModal, setshowModal] = useState(false)
        const [searchText, setsearchText] = useState("")

        const align = props.align
        const title = props.title
        const search = props.search
        const prevData = props.data
        const value = props.value
        const titleColor = props.titleColor
        const selectedColor = props.selectedColor
        const titleAlign = props.titleAlign
        const fontSize = props.fontSize
        const multiSelect = props.multiSelect
        const values = props.values
        const valueExtractor = props.valueExtractor
        const textExtractor = props.textExtractor
        const showValues = props.showValues
        const checkBoxStyle = props.checkBoxStyle

        const prevSelectedIndexes = getMultipleIndexes(prevData, values, valueExtractor, textExtractor)
        const prevSelectedMany = prevData.filter((e, i) => prevSelectedIndexes.includes(i))
        const index = getIndex(prevData, value, valueExtractor, textExtractor)

        const [data, setdata] = useState(prevData)
        const [selected, setselected] = useState(prevData[getIndex(data, value, valueExtractor, textExtractor)][textExtractor])
        const [selectedIndexes, setselectedIndexes] = useState(prevSelectedIndexes)
        const [selectedMany, setselectedMany] = useState(prevSelectedMany)
        const [currentSelectedValues, setcurrentSelectedValues] = useState(selectedMany)
        const [currentSelectedIndexes, setcurrentSelectedIndexes] = useState(selectedIndexes)

        const openModal = () => {
            setshowModal(true)
            Animated.timing(zoom, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            }).start();
        }

        useEffect(() => {
            if (!multiSelect) {
                setselected(prevData[getIndex(data, value, valueExtractor, textExtractor)][textExtractor])
            } else {
                setselectedMany(prevData.filter((e, i) => selectedIndexes.includes(i)))
            }
            setdata(prevData)
        }, [value, prevData])

        const onSelect = (e, index) => {
            if (!multiSelect) {
                setselected(e[textExtractor])
                Animated.timing(zoom, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false
                }).start();
                setTimeout(() => {
                    props.onSelect(e[valueExtractor], e[textExtractor]);
                    setshowModal(false)
                    setsearchText('')
                    setdata(prevData)
                }, 300)
            } else {
                if (selectedIndexes.includes(index)) {
                    const newIndexesArray = selectedIndexes.filter(e => e !== index)
                    setselectedIndexes(newIndexesArray)
                    setselectedMany(prevData.filter((e, i) => newIndexesArray.includes(i)))
                } else {
                    setselectedIndexes([...selectedIndexes, index])
                    setselectedMany(prevData.filter((e, i) => [...selectedIndexes, index].includes(i)))
                }
            }
        }

        const onCancel = () => {
            setselectedIndexes(currentSelectedIndexes)
            setselectedMany(currentSelectedValues)
            Animated.timing(zoom, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            setTimeout(() => {
                setshowModal(false)
                setsearchText('')
                setdata(prevData)
            }, 300)
        }

        const onConfirm = () => {
            setcurrentSelectedValues(selectedMany)
            setcurrentSelectedIndexes(selectedIndexes)
            props.onConfirm(currentSelectedValues)
            Animated.timing(zoom, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            setTimeout(() => {
                setshowModal(false)
                setsearchText('')
                setdata(prevData)
            }, 300)
        }

        const onSearch = (e) => {
            try {
                const newString = `${e}`.toLowerCase()
                const newData = prevData.filter(e => `${e.text}`.toLowerCase().includes(newString))
                setdata(newData)
                setsearchText(`${e}`)
            } catch (error) {
                console.log(error)
            }
        }

        return (
            <View>
                <View style={{ justifyContent: 'center', alignContent: 'center', flexDirection: align }}>
                    {title && <Text style={[s.title, { color: titleColor, textAlign: titleAlign, fontSize: fontSize }]}>{title}:</Text>}
                    <TouchableOpacity style={{}} onPress={() => openModal()} >
                        {!multiSelect ?
                            <Text style={[s.title, { color: selectedColor, textAlign: titleAlign, fontSize: fontSize }]}>{selected}</Text> :
                            <View style={[{ flexDirection: 'row', flexWrap: "wrap" }]}>
                                {selectedMany.length && showValues ? selectedMany.map((e, i) => (
                                    <Text key={i} style={[s.title, { color: selectedColor, textAlign: titleAlign, fontSize: fontSize }]}>{e[textExtractor]}</Text>
                                )) :
                                    <Text style={[s.title, { color: selectedColor, textAlign: titleAlign, fontSize: fontSize }]}>Select</Text>
                                }
                            </View>
                        }
                    </TouchableOpacity>
                </View>

                {
                    showModal &&
                    <View>
                        <Modal
                            transparent={true}
                            onRequestClose={() => onCancel()}
                        >
                            <Pressable style={[s.outside]} onPress={() => onCancel()} >
                                <Animated.View style={[s.main, { transform: [{ scale: zoom }] }]}>
                                    <View style={[s.flatListContainer]}>
                                        {search && <TextInput placeholder='Search' style={[s.input, { fontSize: fontSize }]} value={`${searchText}`} onChangeText={(e) => onSearch(e)} />}
                                        <FlatList
                                            keyExtractor={(item, index) => `${index}`}
                                            data={data}
                                            renderItem={({ item, index }) => {
                                                if (!multiSelect) {
                                                    return (
                                                        <TouchableOpacity key={index} style={[s.item, { backgroundColor: item[textExtractor] === selected ? 'grey' : 'white' }]} onPress={() => { onSelect(item, index) }}>
                                                            <Text style={[{ color: 'black', fontSize: fontSize }]}>{item[textExtractor]}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                } else {
                                                    return (
                                                        <TouchableOpacity key={index} style={[s.item, s.itemWithCheckBox]} onPress={() => { onSelect(item, index) }}>
                                                            <Text style={[{ color: 'black', fontSize: fontSize }]}>{item[textExtractor]}</Text>
                                                            <View
                                                                style={[s.checkBox, checkBoxStyle, { width: fontSize, height: fontSize, backgroundColor: selectedIndexes.includes(index) ? selectedColor : 'white' }]} >
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }

                                            }}
                                            initialScrollIndex={searchText.length > 0 ? false : index}
                                        />
                                        {multiSelect &&
                                            <Pressable style={[s.confirmCancelBtn]} >
                                                <TouchableOpacity onPress={onCancel} style={[{ flexGrow: .5, borderRightColor: 'grey', borderRightWidth: 1 }]}>
                                                    <Text style={[s.btns]} >Cancel</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={onConfirm} style={[{ flexGrow: .5, borderLeftColor: 'grey', borderLeftWidth: 1 }]}>
                                                    <Text style={[s.btns]} >Confirm</Text>
                                                </TouchableOpacity>
                                            </Pressable>
                                        }
                                    </View>
                                </Animated.View>
                            </Pressable>
                        </Modal>
                    </View>
                }
            </View>
        )
    } catch (error) {
        console.log(error)
        return (
            <View>

            </View>
        )
    }
}

PopupPicker.defaultProps = defaultProps;

export default PopupPicker;