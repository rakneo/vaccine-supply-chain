import React, { useEffect, useState } from 'react';
import { useWeb3Context } from 'web3-react'
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import {Button, KIND as ButtonKind} from 'baseui/button';
import Plus from 'baseui/icon/plus';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
    SIZE,
    ROLE
  } from "baseui/modal";
import { FormControl } from "baseui/form-control";
import {Input, SIZE as inputSize} from 'baseui/input';
import {
    useSnackbar,
  } from 'baseui/snackbar';
import useInstance from '../hooks/useInstance';
import API from '../utils/contract-api';
import { addTxToLogs } from '../utils/common';

export default () => {

    const [api, setApi] = useState(null);
    const [isBdModalOpen, setIsBdModalOpen] = useState(false);
    const [isBpModalOpen, setIsBpModalOpen] = useState(false);
    const [isMdlModalOpen, setIsMdlModalOpen] = useState(false);
    const [isPdlModalOpen, setIsPdlModalOpen] = useState(false);
    const [isSdlModalOpen, setIsSdlModalOpen] = useState(false);
    const [isShipModalOpen, setIsShipModalOpen] = useState(false);
    const [isUseModalOpen, setIsUseModalOpen] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [bdData, setBdData] = useState({
        udpc: "",
        price: "",
    });
    const [bpData, setBpData] = useState({
        udpc: "",
        m_name: "",
    });
    const [mdlData, setMdlData] = useState({
        udpc: "",
        qty: 0,
    });
    const [pdlData, setPdlData] = useState({
        slu: "",
    });
    const [sdlData, setSdlData] = useState({
        slu: "",
        u_price: ""
    });
    const [shipData, setShipData] = useState({
        slu: ""
    });
    const [useData, setUseData] = useState({
        slu: "",
        humidity: "",
        temprature: ""
    });
    const {enqueue} = useSnackbar();
    const context = useWeb3Context();
    const instance = useInstance();

    useEffect(() => {
        if(instance != null){
            setApi(new API(instance));
        }
    }, [instance]);


    const handleBuy = async () => {
        try {
            setIsButtonLoading(true);
            const trxn = await api.purchaseDrugDesign(context, bdData);
            const logs = addTxToLogs(trxn);
            logs.forEach((log) => console.log(log));
            setIsButtonLoading(false);
            setIsBdModalOpen(false);
            enqueue({message: `Drug Design Bought For ${bdData.price} ETH | UDPC: ${bdData.udpc}`});
        } catch (err) {
            console.log(err);
        }
    }

    const handleBpForm = async () => {
        try {
            setIsButtonLoading(true);
            const trxn = await api.buildPartnership(context.account, bpData);
            const logs = addTxToLogs(trxn);
            logs.forEach((log) => console.log(log));
            setIsButtonLoading(false);
            setIsBpModalOpen(false);
            enqueue({message: `Partnership Built | UDPC: ${bpData.udpc}`});
        } catch (err) {
            console.log(err);
        }
    }

    const handleMdlForm = async () => {
        try {
            setIsButtonLoading(true);
            const trxn = await api.manufactureDrugLoad(context.account, mdlData);
            const logs = addTxToLogs(trxn);
            logs.forEach((log) => console.log(log));
            setIsButtonLoading(false);
            setIsMdlModalOpen(false);
            enqueue({message: `Manufacted Drug Load | UDPC: ${mdlData.udpc}`});
        } catch (err) {
            console.log(err);
            setIsButtonLoading(false);
        }
    }

    const handlePdlForm = async () => {
        try {
            setIsButtonLoading(true);
            const trxn = await api.packDrugLoad(context.account, pdlData);
            const logs = addTxToLogs(trxn);
            logs.forEach((log) => console.log(log));
            setIsButtonLoading(false);
            setIsPdlModalOpen(false);
            enqueue({message: `Packed Drug Load | SLU: ${pdlData.slu}`});
        } catch (err) {
            console.log(err);
            setIsButtonLoading(false);
        }
    }

    const handleSdlForm = async () => {
        try {
            setIsButtonLoading(true);
            const trxn = await api.sellDrugLoad(context, sdlData);
            const logs = addTxToLogs(trxn);
            logs.forEach((log) => console.log(log));
            setIsButtonLoading(false);
            setIsSdlModalOpen(false);
            enqueue({message: `Sell Drug Load | SLU: ${sdlData.slu}`});
        } catch (err) {
            console.log(err);
            setIsButtonLoading(false);
        }
    }

    const handleShipForm = async () => {
        try {
            setIsButtonLoading(true);
            console.log(shipData);
            const trxn = await api.shipDrugLoad(context.account, shipData);
            const logs = addTxToLogs(trxn);
            logs.forEach((log) => console.log(log));
            setIsButtonLoading(false);
            setIsShipModalOpen(false);
            enqueue({message: `Shipped Drug Load | SLU: ${shipData.slu}`});
        } catch (err) {
            console.log(err);
            setIsButtonLoading(false);
        }
    }

    const handleUseForm = async () => {
        try {
            setIsButtonLoading(true);
            const trxn = await api.updateShipEnv(context.account, useData);
            const logs = addTxToLogs(trxn);
            logs.forEach((log) => console.log(log));
            setIsButtonLoading(false);
            setIsUseModalOpen(false);
            enqueue({message: `Update Shipment ENV for SLU: ${useData.slu}`});
    
        } catch (err) {
            console.log(err);
            setIsButtonLoading(false);
        }
       }


    return (
     <> 
        <FlexGrid>
            <FlexGridItem
                style={{
                    margin: 8,
                    display: 'flex'
                }}
            >
                <Button
                    style={{
                        marginRight: 8,
                        minWidth: 200
                    }}
                    startEnhancer={Plus}
                    onClick={() => setIsBdModalOpen(true)}
                >
                    Buy Drug Design
                </Button>
                <Button
                    style={{
                        minWidth: 200
                    }}
                    startEnhancer={Plus}
                    onClick={() => setIsBpModalOpen(true)}
                >
                    Build Partnership
                </Button>
            </FlexGridItem>
            <FlexGridItem
                style={{
                    margin: 8,
                    marginTop: 0,
                    display: 'flex'
                }}
            >
            <Button
                    style={{
                        marginRight: 8,
                        minWidth: 200
                    }}
                    startEnhancer={Plus}
                    onClick={() => setIsMdlModalOpen(true)}
                >
                     Make Drug Load
                </Button>
            <Button
                style={{
                    
                    minWidth: 200
                }}
                startEnhancer={Plus}
                onClick={() => setIsPdlModalOpen(true)}
            >
                Pack Drug Load
            </Button>
            </FlexGridItem>
            <FlexGridItem
                style={{
                    margin: 8,
                    marginTop: 0,
                    display: 'flex'
                }}
            >
            <Button
                    style={{
                        marginRight: 8,
                        minWidth: 200
                    }}
                    startEnhancer={Plus}
                    onClick={() => setIsSdlModalOpen(true)}
                >
                     Sell Drug Load
                </Button>
            <Button
                style={{
                    marginRight:8,
                    minWidth: 200
                }}
                startEnhancer={Plus}
                onClick={() => setIsShipModalOpen(true)}
            >
                Ship Drug Load
            </Button>
            <Button
               
                    startEnhancer={Plus}
                    onClick={() => setIsUseModalOpen(true)}
                >
                   Update Shipment Environment
                </Button>
            </FlexGridItem>
            
        </FlexGrid>

        {/* Buy Drug Design Form */}

        <Modal
            onClose={() => setIsBdModalOpen(false)}
            closeable
            isOpen={isBdModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Buy Drug Design</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"UDPC"}
                >
                    <Input 
                        value={bdData.udpc}
                        onChange={(e) => setBdData({...bdData, udpc: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Price"}
                >
                    <Input 
                        value={bdData.price}
                        onChange={(e) => setBdData({...bdData, price: e.target.value})}
                    />
                </FormControl>
                    
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleBuy} isLoading={isButtonLoading}>Buy</ModalButton>
            </ModalFooter>
        </Modal>

        {/* Build Partnership Form */}

        <Modal
            onClose={() => setIsBpModalOpen(false)}
            closeable
            isOpen={isBpModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Build Partnership</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"UDPC"}
                >
                    <Input 
                        value={bpData.udpc}
                        onChange={(e) => setBpData({...bpData, udpc: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Manufacturer Name"}
                >
                    <Input 
                        value={bpData.price}
                        onChange={(e) => setBpData({...bpData, m_name: e.target.value})}
                    />
                </FormControl>
                    
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleBpForm} isLoading={isButtonLoading}>Confirm</ModalButton>
            </ModalFooter>
        </Modal>

        {/* Manufacture drug load */}
        
        <Modal
            onClose={() => setIsMdlModalOpen(false)}
            closeable
            isOpen={isMdlModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Manufacture Drug Load</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"UDPC"}
                >
                    <Input 
                        value={mdlData.udpc}
                        onChange={(e) => setMdlData({...mdlData, udpc: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Quantity"}
                >
                    <Input 
                        value={bpData.price}
                        onChange={(e) => setMdlData({...mdlData, qty: e.target.value})}
                    />
                </FormControl>
                    
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleMdlForm} isLoading={isButtonLoading}>Confirm</ModalButton>
            </ModalFooter>
        </Modal>

        {/* Pack Drug Load */}


        <Modal
            onClose={() => setIsPdlModalOpen(false)}
            closeable
            isOpen={isPdlModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Pack Drug Load</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"SLU"}
                >
                    <Input 
                        value={pdlData.slu}
                        onChange={(e) => setPdlData({...pdlData, slu: e.target.value})}
                    />
                </FormControl>      
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handlePdlForm} isLoading={isButtonLoading}>Confirm</ModalButton>
            </ModalFooter>
        </Modal>
        
        {/* Sell Drug Load */}


        <Modal
            onClose={() => setIsSdlModalOpen(false)}
            closeable
            isOpen={isSdlModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Sell Drug Load</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"SLU"}
                >
                    <Input 
                        value={sdlData.slu}
                        onChange={(e) => setSdlData({...sdlData, slu: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Unit Price"}
                >
                    <Input 
                        value={sdlData.u_price}
                        onChange={(e) => setSdlData({...sdlData, u_price: e.target.value})}
                    />
                </FormControl>      
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleSdlForm} isLoading={isButtonLoading}>Sell</ModalButton>
            </ModalFooter>
        </Modal>

    {/* Ship Drug Load */}


    <Modal
        onClose={() => setIsShipModalOpen(false)}
        closeable
        isOpen={isShipModalOpen}
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
    >
        <ModalHeader>Ship Drug Load</ModalHeader>
        <ModalBody>
            <FormControl
                label={"SLU"}
            >
                <Input 
                    value={shipData.slu}
                    onChange={(e) => setShipData({...shipData, slu: e.target.value})}
                />
            </FormControl>      
        </ModalBody>
        <ModalFooter>
            <ModalButton kind={ButtonKind.tertiary}>
                Cancel
            </ModalButton>
            <ModalButton onClick={handleShipForm} isLoading={isButtonLoading}>Confirm</ModalButton>
        </ModalFooter>
    </Modal>

    {/* USE Modal Form */}

    <Modal
            onClose={() => setIsUseModalOpen(false)}
            closeable
            isOpen={isUseModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Update Shipment Environment</ModalHeader>
            <ModalBody>

            <FormControl
                    label={"SLU"}
                >
                    <Input 
                        value={useData.slu}
                        onChange={(e) => setUseData({...useData, slu: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Humidity"}
                >
                    <Input 
                        value={useData.r_addr}
                        onChange={(e) => setUseData({...useData, humidity: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Temprature"}
                >
                    <Input 
                        value={useData.price}
                        onChange={(e) => setUseData({...useData, temprature: e.target.value})}
                    />
                </FormControl>
                    
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleUseForm} isLoading={isButtonLoading}>Confirm</ModalButton>
            </ModalFooter>
        </Modal>




     </>
     );
}