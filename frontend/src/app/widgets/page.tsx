'use client';

import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useState } from 'react';

interface Widget {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export default function Widgets() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      name: 'Support Chat',
      description: 'Customer support chatbot',
      status: 'active',
    },
    // Add more mock data as needed
  ]);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const toast = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const widgetData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: 'inactive' as const,
    };

    if (editingWidget) {
      // Update existing widget
      setWidgets(widgets.map(w => 
        w.id === editingWidget.id 
          ? { ...w, ...widgetData }
          : w
      ));
      toast({
        title: 'Widget updated',
        status: 'success',
        duration: 3000,
      });
    } else {
      // Create new widget
      setWidgets([...widgets, { 
        ...widgetData, 
        id: Date.now().toString(),
      }]);
      toast({
        title: 'Widget created',
        status: 'success',
        duration: 3000,
      });
    }
    
    onClose();
    setEditingWidget(null);
  };

  const handleEdit = (widget: Widget) => {
    setEditingWidget(widget);
    onOpen();
  };

  const handleDelete = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
    toast({
      title: 'Widget deleted',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading>Widgets</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => {
          setEditingWidget(null);
          onOpen();
        }}>
          Add Widget
        </Button>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {widgets.map((widget) => (
            <Tr key={widget.id}>
              <Td>{widget.name}</Td>
              <Td>{widget.description}</Td>
              <Td>{widget.status}</Td>
              <Td>
                <IconButton
                  aria-label="Edit widget"
                  icon={<FiEdit2 />}
                  mr={2}
                  onClick={() => handleEdit(widget)}
                />
                <IconButton
                  aria-label="Delete widget"
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  onClick={() => handleDelete(widget.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingWidget ? 'Edit Widget' : 'Create Widget'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    defaultValue={editingWidget?.name}
                    placeholder="Enter widget name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Input
                    name="description"
                    defaultValue={editingWidget?.description}
                    placeholder="Enter widget description"
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full">
                  {editingWidget ? 'Update' : 'Create'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 