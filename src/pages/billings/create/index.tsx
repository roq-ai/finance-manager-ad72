import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createBilling } from 'apiSdk/billings';
import { Error } from 'components/error';
import { billingValidationSchema } from 'validationSchema/billings';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { BillingInterface } from 'interfaces/billing';

function BillingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BillingInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBilling(values);
      resetForm();
      router.push('/billings');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BillingInterface>({
    initialValues: {
      cost: 0,
      due_date: new Date(new Date().toDateString()),
      category: '',
      paid_status: false,
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: billingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Billing
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="cost" mb="4" isInvalid={!!formik.errors?.cost}>
            <FormLabel>Cost</FormLabel>
            <NumberInput
              name="cost"
              value={formik.values?.cost}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('cost', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.cost && <FormErrorMessage>{formik.errors?.cost}</FormErrorMessage>}
          </FormControl>
          <FormControl id="due_date" mb="4">
            <FormLabel>Due Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.due_date ? new Date(formik.values?.due_date) : null}
                onChange={(value: Date) => formik.setFieldValue('due_date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <FormControl id="category" mb="4" isInvalid={!!formik.errors?.category}>
            <FormLabel>Category</FormLabel>
            <Input type="text" name="category" value={formik.values?.category} onChange={formik.handleChange} />
            {formik.errors.category && <FormErrorMessage>{formik.errors?.category}</FormErrorMessage>}
          </FormControl>
          <FormControl
            id="paid_status"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.paid_status}
          >
            <FormLabel htmlFor="switch-paid_status">Paid Status</FormLabel>
            <Switch
              id="switch-paid_status"
              name="paid_status"
              onChange={formik.handleChange}
              value={formik.values?.paid_status ? 1 : 0}
            />
            {formik.errors?.paid_status && <FormErrorMessage>{formik.errors?.paid_status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'billing',
    operation: AccessOperationEnum.CREATE,
  }),
)(BillingCreatePage);
