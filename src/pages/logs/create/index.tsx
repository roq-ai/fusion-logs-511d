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
import { createLog } from 'apiSdk/logs';
import { Error } from 'components/error';
import { logValidationSchema } from 'validationSchema/logs';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { GameServerInterface } from 'interfaces/game-server';
import { getGameServers } from 'apiSdk/game-servers';
import { LogInterface } from 'interfaces/log';

function LogCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: LogInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createLog(values);
      resetForm();
      router.push('/logs');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<LogInterface>({
    initialValues: {
      player_id: '',
      date: new Date(new Date().toDateString()),
      type: '',
      permission: '',
      game_server_id: (router.query.game_server_id as string) ?? null,
    },
    validationSchema: logValidationSchema,
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
            Create Log
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="player_id" mb="4" isInvalid={!!formik.errors?.player_id}>
            <FormLabel>Player Id</FormLabel>
            <Input type="text" name="player_id" value={formik.values?.player_id} onChange={formik.handleChange} />
            {formik.errors.player_id && <FormErrorMessage>{formik.errors?.player_id}</FormErrorMessage>}
          </FormControl>
          <FormControl id="date" mb="4">
            <FormLabel>Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.date ? new Date(formik.values?.date) : null}
                onChange={(value: Date) => formik.setFieldValue('date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <FormControl id="type" mb="4" isInvalid={!!formik.errors?.type}>
            <FormLabel>Type</FormLabel>
            <Input type="text" name="type" value={formik.values?.type} onChange={formik.handleChange} />
            {formik.errors.type && <FormErrorMessage>{formik.errors?.type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="permission" mb="4" isInvalid={!!formik.errors?.permission}>
            <FormLabel>Permission</FormLabel>
            <Input type="text" name="permission" value={formik.values?.permission} onChange={formik.handleChange} />
            {formik.errors.permission && <FormErrorMessage>{formik.errors?.permission}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<GameServerInterface>
            formik={formik}
            name={'game_server_id'}
            label={'Select Game Server'}
            placeholder={'Select Game Server'}
            fetcher={getGameServers}
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
    entity: 'log',
    operation: AccessOperationEnum.CREATE,
  }),
)(LogCreatePage);
