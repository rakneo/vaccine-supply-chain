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
import {
    Checkbox,
    STYLE_TYPE,
    LABEL_PLACEMENT
} from "baseui/checkbox";
import { Textarea } from "baseui/textarea";
import useInstance from '../hooks/useInstance';
import API from '../utils/contract-api';
import { addTxToLogs } from '../utils/common';


export default (props) => {

    const [api, setApi] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isTcModalOpen, setIsTcModalOpen] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const {enqueue} = useSnackbar();

    const [dpData, setDpData] = useState({
        udpc: 0,
    });

    const [tcData, setTcData] = useState({
        udpc: 0,
        description: "",
        notes: "",
        passed: false
    });

    const context = useWeb3Context();
    const instance = useInstance();

    useEffect(() => {
        if(instance != null){
            setApi(new API(instance));
        }
    }, [instance]);

   const handleApproveDrugForm = async () => {
    try {
        setIsButtonLoading(true);
        const trxn = await api.approveDrug(context.account, dpData);
        console.log(trxn);
        setIsButtonLoading(false);
        setIsApproveModalOpen(false);
        enqueue({message: `UDPC: ${dpData.udpc} | Approved`});
    } catch(err){
        console.log(err);
    }

   }

   const handleTestCaseForm = async () => {
    try {
        setIsButtonLoading(true);
        const trxn = await api.addDesignerTestCase(context.account, tcData);
        const logs = addTxToLogs(trxn);
        logs.forEach((log) => console.log(log));
        setIsButtonLoading(false);
        setIsTcModalOpen(false);
        enqueue({message: `Test Case Added For UDPC: ${tcData.udpc}`});

    } catch (err) {
        console.log(err);
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
                    onClick={() => setIsApproveModalOpen(true)}
                >
                   Approve Drug 
                </Button>

                <Button
                    startEnhancer={Plus}
                    onClick={() => setIsTcModalOpen(true)}
                >
                   Add Test 
                </Button>
            </FlexGridItem>
        </FlexGrid>

        {/* Aprove Drug Form */}

        <Modal
            onClose={() => setIsApproveModalOpen(false)}
            closeable
            isOpen={isApproveModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Add New Drug Test Case</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"UDPC"}
                >
                    <Input 
                        value={dpData.udpc}
                        type="number"
                        onChange={(e) => setDpData({...dpData, udpc: parseInt(e.target.value)})}
                    />
                </FormControl>
                    
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleApproveDrugForm} isLoading={isButtonLoading}>Approve</ModalButton>
            </ModalFooter>
        </Modal>

        {/* Test Case Modal Form */}

        <Modal
            onClose={() => setIsTcModalOpen(false)}
            closeable
            isOpen={isTcModalOpen}
            animate
            autoFocus
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Add New Drug Test Case</ModalHeader>
            <ModalBody>
                <FormControl
                    label={"UDPC"}
                >
                    <Input 
                        value={tcData.udpc}
                        type="number"
                        onChange={(e) => setTcData({...tcData, udpc: parseInt(e.target.value)})}
                    />
                </FormControl>
                <FormControl
                    label={"Description"}
                >
                    <Textarea
                        size={inputSize.compact}
                        value={tcData.description}
                        onChange={e => setTcData({ ...tcData, description: e.currentTarget.value})}
                        placeholder="Test Case Description"
                    />
                </FormControl>
                <FormControl
                    label={"Notes"}
                >
                    <Textarea
                        size={inputSize.compact}
                        value={tcData.notes}
                        onChange={e => setTcData({ ...tcData, notes: e.currentTarget.value})}
                        placeholder="Test Case Notes"
                    />
                </FormControl>
                <Checkbox
                    checked={tcData.passed}
                    checkmarkType={STYLE_TYPE.toggle_round}
                    onChange={e => setTcData({...tcData, passed: e.target.checked})}
                    labelPlacement={LABEL_PLACEMENT.right}
                    >
                    Passed
                </Checkbox>
                    
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={handleTestCaseForm} isLoading={isButtonLoading}>Confirm</ModalButton>
            </ModalFooter>
        </Modal>
     </>);
} 