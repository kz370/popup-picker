import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, FlatList, Animated, StyleSheet, TextInput, Pressable, TouchableOpacity } from 'react-native';

const getIndex = (array, value) => {
    let i, index
    for (i = 0; i < array.length; i++) {
        if (`${value}` === `${array[i].value}` || `${value}` === `${array[i].text}`) {
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
    align?: 'column' | 'row'|'row-reverse','column-reverse',
    /** Sets the title name*/
    title?: string;
    // /** Change the back-ground color of datePicker */
    style?: object;
    /** An array of list values must be in [{text:'',value:''}] form */
    data?: Array;
    /** Enable search through data  */
    search?: boolean
    /** set the selected value */
    value?: string | number
    /** Change the color of the title */
    titleColor?: string
    /** Change the color of the button */
    selectedColor?: string
    /** Set title align */
    titleAlign?: 'center' | 'left' | 'right'
    /** change font size for the title and list and button */
    fontSize?: number
}

const defaultProps: OptionalProps = {
    align: "column",
    title: "Select",
    style: {},
    data: [],
    search: false,
    value: null,
    titleColor: 'black',
    selectedColor: 'black',
    titleAlign: 'center',
    fontSize: 18
}

interface AllProps extends OptionalProps, RequiredProps { }


export default function PopupList(props: AllProps) {
    const zoom = useRef(new Animated.Value(0)).current;
    const [showModal, setshowModal] = useState(false)
    const [searchText, setsearchText] = useState("")

    const align = props.align
    const title = props.title
    const style = props.style
    const search = props.search
    const prevData = props.data
    const value = props.value
    const titleColor = props.titleColor
    const selectedColor = props.selectedColor
    const titleAlign = props.titleAlign
    const fontSize = props.fontSize

    const index = getIndex(prevData, value)
    const [data, setdata] = useState(prevData)
    const [selected, setselected] = useState(value)

    const openModal = () => {
        setshowModal(true)
        Animated.timing(zoom, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
        }).start();
    }

    useEffect(() => {
        setselected(value)
        setdata(prevData)
    }, [value, prevData])

    const onSelect = (e) => {
        setselected(e.text)
        Animated.timing(zoom, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
        }).start();
        setTimeout(() => {
            props.onSelect(e.value, e.text);
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
        <View style={[style]}>
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
                                        data={data}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity key={index} style={[s.item, { backgroundColor: item.text === selected ? 'grey' : 'white' }]} onPress={() => { onSelect(item) }}>
                                                <Text style={[{ color: 'black', fontSize: fontSize }]}>{item.text}</Text>
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

const s = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        elevation: 50,
    },
    outside: {
        flex: 1,
    },
    modalContainer: {
        justifyContent: 'center',
        position: 'absolute',
        width: "100%",
        height: "100%",
        backgroundColor: 'red'
    },
    title: {
        margin: 5
    },
    input: {
        backgroundColor: 'rgba(255,255,255,.5)',
        padding: 20
    },
    flatListContainer: {
        backgroundColor: 'grey',
        justifyContent: 'center',
        elevation: 50,
        borderRadius: 15,
        overflow: 'hidden',
        maxHeight: 500,
        marginHorizontal: 30,
    },
    item: {
        backgroundColor: '#f9c2ff',
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        padding: 20,
    }
})