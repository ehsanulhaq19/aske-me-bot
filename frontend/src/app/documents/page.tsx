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
  useToast,
  Heading,
  Input,
  FormControl,
  FormLabel,
  VStack,
} from '@chakra-ui/react';
import { FiTrash2, FiUpload } from 'react-icons/fi';
import { useState, useRef } from 'react';

interface Document {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'training-data.pdf',
      size: '2.5 MB',
      uploadedAt: new Date().toLocaleDateString(),
    },
    // Add more mock data as needed
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    // Mock upload - in real app, you'd send to server
    const newDocuments = Array.from(files).map(file => ({
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toLocaleDateString(),
    }));

    setDocuments([...documents, ...newDocuments]);
    toast({
      title: 'Document uploaded',
      status: 'success',
      duration: 3000,
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: 'Document deleted',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading>Documents</Heading>
        <FormControl width="auto">
          <Input
            type="file"
            multiple
            onChange={handleUpload}
            ref={fileInputRef}
            display="none"
            id="file-upload"
          />
          <Button
            as="label"
            htmlFor="file-upload"
            leftIcon={<FiUpload />}
            colorScheme="blue"
            cursor="pointer"
          >
            Upload Documents
          </Button>
        </FormControl>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Size</Th>
            <Th>Uploaded</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {documents.map((doc) => (
            <Tr key={doc.id}>
              <Td>{doc.name}</Td>
              <Td>{doc.size}</Td>
              <Td>{doc.uploadedAt}</Td>
              <Td>
                <IconButton
                  aria-label="Delete document"
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  onClick={() => handleDelete(doc.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
} 