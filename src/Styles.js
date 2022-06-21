import { StyleSheet } from "react-native"
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

export default s