import React, { useEffect, useState } from 'react';
import { useWeb3Context } from 'web3-react'
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import {Button, KIND as ButtonKind} from 'baseui/button';
import Plus from 'baseui/icon/plus'
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
import { Table } from "baseui/table-semantic";
import useInstance from '../hooks/useInstance';
import API from '../utils/contract-api';
import { addTxToLogs } from '../utils/common';





export default () => {
    const [api, setApi] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBdModalOpen, setIsBdModalOpen] = useState(false);
    const [isTestCaseModalOpen, setIsTestCaseModalOpen] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const {enqueue} = useSnackbar();
    const [data, setData] = useState({
        designerName: "",
        drugName: "",
        description: "",
        notes: ""
    });
    const [tcData, setTcData] = useState({
        udpc: 0,
        description: "",
        notes: "",
        passed: false
    });
    const [bdData, setBdData] = useState({
        udpc: "",
        price: "",
    });
    const [drugDesignData, setDrugDesignData] = useState([]);
    const context = useWeb3Context();
    const instance = useInstance();

    useEffect(() => {
        if(instance != null){
            setApi(new API(instance));
        }
    }, [instance]);

    useEffect(() => {
        if(instance != null && api != null){
            api.getDrugDesigns(context.account)
            .then((res) => {

                console.log(res);

                const _list = [];

                res.forEach((item, idx) => {
                    _list.push([
                        idx+1,
                        item.currentOwner,
                        item.drugName,
                        item.designerName,
                        item.currentState,
                        (item.forSale) ? "Yes" : "No",
                        item.numberOfTests
                    ]);
                });
                setDrugDesignData(_list);
                console.log(_list);
            })
        }
    }, [api]);

    const handleDrugDesignForm = async () => {

        try {
            setIsButtonLoading(true);
            const trxn = await api.designDrug(context.account, data);
            console.log(addTxToLogs(trxn));
            setIsButtonLoading(false);
            setIsModalOpen(false);
            enqueue({message: "Drug Design Added."})
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
            setIsTestCaseModalOpen(false);
            enqueue({message: `Test Case Added For UDPC: ${tcData.udpc}`});

        } catch (err) {
            console.log(err);
        }
    }


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

   
  



    return (
    <>  
        <FlexGrid>
            <FlexGridItem style={{
                width: '50%',
                margin: 16,
                display: 'flex',
            }}>

            <Button
            style={{
                marginRight: 8,
            }} 
            startEnhancer={Plus} 
            onClick={() => setIsTestCaseModalOpen(true)}> 
                Add Test Case
            </Button>
            <Button 
            style={{
                marginRight: 8,
            }}
            startEnhancer={Plus} 
            onClick={() => setIsModalOpen(true)}> 
                Add Drug Design
            </Button>
            <Button
                    startEnhancer={Plus}
                    onClick={() => setIsBdModalOpen(true)}
                >
                    Buy Drug Design
                </Button>
            </FlexGridItem>
            <FlexGridItem
                style={{
                    width: '50%',
                    margin: 16,
                    display: 'flex',
                }}
            >
                <Table
                    columns={["UDPC", "Owner", "Drug Name", "Designer Name", "Status", "For Sale", "Number Of Tests"]}
                    data={drugDesignData}
                />
                
            </FlexGridItem>
            <FlexGridItem
                style={{
                    width: '50%',
                    margin: 16,
                    display: 'flex'
                }}
            >

            </FlexGridItem>
        </FlexGrid>

        {/* Drug Design From */}
        
        <Modal
                onClose={() => setIsModalOpen(false)}
                closeable
                isOpen={isModalOpen}
                animate
                autoFocus
                size={SIZE.default}
                role={ROLE.dialog}
                >
                    <ModalHeader>Add New Drug Design</ModalHeader>
                    <ModalBody>
                        <FormControl
                            label={"Designer Name"}
                        >
                            <Input 
                                value={data.designerName}
                                onChange={(e) => setData({...data, designerName: e.target.value})}
                            />
                        </FormControl>
                        <FormControl
                            label={"Drug Name"}
                        >
                            <Input 
                                value={data.drugName}
                                onChange={(e) => setData({...data, drugName: e.target.value})}
                            />
                        </FormControl>
                        <FormControl
                            label={"Description"}
                        >
                           <Textarea
                                size={inputSize.compact}
                                value={data.description}
                                onChange={e => setData({ ...data, description: e.currentTarget.value})}
                                placeholder="Drug Description"
                            />
                        </FormControl>
                        <FormControl
                            label={"Notes"}
                        >
                           <Textarea
                                size={inputSize.compact}
                                value={data.notes}
                                onChange={e => setData({ ...data, notes: e.currentTarget.value})}
                                placeholder="Designer's Notes"
                            />
                        </FormControl>
                        
                    </ModalBody>
                    <ModalFooter>
                        <ModalButton kind={ButtonKind.tertiary}>
                        Cancel
                        </ModalButton>
                        <ModalButton onClick={handleDrugDesignForm} isLoading={isButtonLoading}>Confirm</ModalButton>
                    </ModalFooter>
            </Modal>
                
        {/* Drug Test Case Form */}

        <Modal
            onClose={() => setIsTestCaseModalOpen(false)}
            closeable
            isOpen={isTestCaseModalOpen}
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
    </>
    );

}