import React, { useEffect, useState } from 'react';
import { useWeb3Context } from 'web3-react'
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import {Button, KIND as ButtonKind} from 'baseui/button';
import Plus from 'baseui/icon/plus';
import Check from 'baseui/icon/check';
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


export default (props) => {

    const [api, setApi] = useState(null);
    const [isBdlModalOpen, setIsBdlModalOpen] = useState(false);
    const [isUseModalOpen, setIsUseModalOpen] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const {enqueue} = useSnackbar();

    const [bdlData, setBdlData] = useState({
        slu: "",
        r_addr: "",
        price: ""
    });

    const [useData, setUseData] = useState({
        slu: "",
        humidity: "",
        temprature: ""
    });

    const context = useWeb3Context();
    const instance = useInstance();

    useEffect(() => {
        if(instance != null){
            setApi(new API(instance));
        }
    }, [instance]);

   const handleBdlForm = async () => {
    try {
        setIsButtonLoading(true);
        const trxn = await api.buyDrugLoad(context, bdlData);
        const logs = addTxToLogs(trxn);
        logs.forEach((log) => console.log(log));
        setIsButtonLoading(false);
        setIsBdlModalOpen(false);
        enqueue({message: `Bought Drug Load : SLU-${bdlData.slu}`});
    } catch(err){
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
                    margin: 16,
                    float: 'right'
                }}
            >
                <Button
                    style={{
                        marginRight: 8,
                    }}
                    startEnhancer={Check}
                    onClick={() => setIsBdlModalOpen(true)}
                >
                   Buy Drug Load 
                </Button>

                <Button
                    startEnhancer={Plus}
                    onClick={() => setIsUseModalOpen(true)}
                >
                   Update Shipment Environment
                </Button>
            </FlexGridItem>
        </FlexGrid>

        {/* Buy Drug Load Form */}

        <Modal
            onClose={() => setIsBdlModalOpen(false)}
            closeable
            isOpen={isBdlModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Buy Drug Load</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"SLU"}
                >
                    <Input 
                        value={bdlData.slu}
                        onChange={(e) => setBdlData({...bdlData, slu: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Retailer Address"}
                >
                    <Input 
                        value={bdlData.r_addr}
                        onChange={(e) => setBdlData({...bdlData, r_addr: e.target.value})}
                    />
                </FormControl>
                <FormControl
                    label={"Price"}
                >
                    <Input 
                        value={bdlData.price}
                        onChange={(e) => setBdlData({...bdlData, price: e.target.value})}
                    />
                </FormControl>
                    
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleBdlForm} isLoading={isButtonLoading}>Buy</ModalButton>
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
     </>);
} 