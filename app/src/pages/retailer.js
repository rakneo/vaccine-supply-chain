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
    const [isRdlModalOpen, setIsRdlModalOpen] = useState(false);
    const [isUseModalOpen, setIsUseModalOpen] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const {enqueue} = useSnackbar();

    const [rdlData, setRdlData] = useState({
        slu: "",
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

   const handleRdlForm = async () => {
    try {
        setIsButtonLoading(true);
        const trxn = await api.receiveDrugLoad(context.account, rdlData);
        const logs = addTxToLogs(trxn);
        logs.forEach((log) => console.log(log));
        setIsButtonLoading(false);
        setIsRdlModalOpen(false);
        enqueue({message: `Bought Drug Load : SLU-${rdlData.slu}`});
    } catch(err){
        console.log(err);
        setIsButtonLoading(false);
    }

   }

   const handleUseForm = async () => {
    try {
        setIsButtonLoading(true);
        const trxn = await api.updateStockEnv(context.account, useData);
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
                    onClick={() => setIsRdlModalOpen(true)}
                >
                Receive Drug Load 
                </Button>

                <Button
                    startEnhancer={Plus}
                    onClick={() => setIsUseModalOpen(true)}
                >
                   Update Stocking Environment
                </Button>
            </FlexGridItem>
        </FlexGrid>

        {/* Buy Drug Load Form */}

        <Modal
            onClose={() => setIsRdlModalOpen(false)}
            closeable
            isOpen={isRdlModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Receive Drug Load</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"SLU"}
                >
                    <Input 
                        value={rdlData.slu}
                        onChange={(e) => setRdlData({...rdlData, slu: e.target.value})}
                    />
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleRdlForm} isLoading={isButtonLoading}>Receive</ModalButton>
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
            <ModalHeader>Update Stocking Environment</ModalHeader>
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