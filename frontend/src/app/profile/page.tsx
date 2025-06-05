'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Card,
  CardBody,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function Profile() {
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: PasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Mock API call - in real app, you'd send to server
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: 'Password updated successfully',
          status: 'success',
          duration: 3000,
        });
        
        resetForm();
      } catch (error) {
        toast({
          title: 'Error updating password',
          description: 'Please try again',
          status: 'error',
          duration: 3000,
        });
      }
    },
  });

  return (
    <Box maxW="container.md" mx="auto">
      <Heading mb={6}>Profile Settings</Heading>
      
      <Card>
        <CardBody>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4}>
              <FormControl 
                isInvalid={!!(formik.errors.currentPassword && formik.touched.currentPassword)}
              >
                <FormLabel>Current Password</FormLabel>
                <Input
                  type="password"
                  {...formik.getFieldProps('currentPassword')}
                />
                <FormErrorMessage>
                  {formik.errors.currentPassword}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!(formik.errors.newPassword && formik.touched.newPassword)}
              >
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  {...formik.getFieldProps('newPassword')}
                />
                <FormErrorMessage>
                  {formik.errors.newPassword}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!(formik.errors.confirmPassword && formik.touched.confirmPassword)}
              >
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  {...formik.getFieldProps('confirmPassword')}
                />
                <FormErrorMessage>
                  {formik.errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={formik.isSubmitting}
              >
                Update Password
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
} 