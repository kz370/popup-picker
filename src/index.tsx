import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, FlatList, Animated, TextInput, Pressable, TouchableOpacity } from 'react-native';
import s from './Styles'

const getIndex = (array, value, valueExtractor, textExtractor) => {
    let i, index
    for (i = 0; i < array.length; i++) {
        if (`${value}` === `${array[i][valueExtractor]}` || `${value}` === `${array[i][textExtractor]}`) {
            index = i
        }
    }
    return index
}


interface RequiredProps {
    /** required! 
     * returns (value,text) when pressed text value is not essential */
    onSelect: (value: string | number, text: string) => void
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
    /** enables multiple seletion */
    multiple?: boolean
    /** replace value key with a custom one */
    valueExtractor?: string
    /** replace text key with a custom one */
    textExtractor?: string
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
    multiple: false,
    valueExtractor: 'value',
    textExtractor: 'text'
}

interface AllProps extends OptionalProps, RequiredProps { }

const PopupPicker = (props: AllProps) => {
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
    const multple = props.multiple
    const valueExtractor = props.valueExtractor
    const textExtractor = props.textExtractor

    const index = getIndex(prevData, value, valueExtractor, textExtractor)
    const [data, setdata] = useState(prevData)
    const [selected, setselected] = useState(prevData[getIndex(data, value, valueExtractor, textExtractor)][textExtractor])

    const openModal = () => {
        setshowModal(true)
        Animated.timing(zoom, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
        }).start();
    }

    useEffect(() => {
        setselected(prevData[getIndex(data, value, valueExtractor, textExtractor)][textExtractor])
        setdata(prevData)
    }, [value, prevData])

    const onSelect = (e) => {
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
    }

    const onCancel = () => {
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
                    <Text style={[s.title, { color: selectedColor, textAlign: titleAlign, fontSize: fontSize }]}>{selected}</Text>
                </TouchableOpacity>
            </View>

            {showModal &&
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
                                        keyExtractor={(item, index) => item[valueExtractor]}
                                        data={data}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity key={index} style={[s.item, { backgroundColor: item[textExtractor] === selected ? 'grey' : 'white' }]} onPress={() => { onSelect(item) }}>
                                                <Text style={[{ color: 'black', fontSize: fontSize }]}>{item[textExtractor]}</Text>
                                            </TouchableOpacity>
                                        )}
                                        initialScrollIndex={searchText.length > 0 ? false : index}
                                    />
                                </View>
                            </Animated.View>
                        </Pressable>
                    </Modal>
                </View>}
        </View>
    )
}

PopupPicker.defaultProps = defaultProps;

export default PopupPicker;