export const addTxToLogs =  (tx) => {
    let txHash = tx.transactionHash
    let eventName = Object.keys(tx.events)[0]
    let eventValueName = Object.keys(tx.events[eventName]['returnValues'])[1]
    let eventValue = tx.events[eventName]['returnValues'][eventValueName]

    let updatedLogs = []
    let newLogHash = '$|>>Transaction Hash:' + txHash
    let newLogEvent ='|-----|Event:' + eventName + '(' + eventValueName + ': ' + eventValue + ' )'
    
    updatedLogs.push(newLogHash+newLogEvent)
    return updatedLogs;
}