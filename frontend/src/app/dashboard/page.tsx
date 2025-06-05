'use client';

import {
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import useStore from '@/store';

export default function Dashboard() {
  const { widgets, files, user } = useStore();

  return (
    <DashboardLayout>
      <Heading mb={6}>Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Widgets</StatLabel>
              <StatNumber>{widgets.length}</StatNumber>
              <StatHelpText>All created widgets</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Active Widgets</StatLabel>
              <StatNumber>
                {widgets.filter(w => w.status === 'active').length}
              </StatNumber>
              <StatHelpText>Currently active widgets</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Documents</StatLabel>
              <StatNumber>{files.length}</StatNumber>
              <StatHelpText>Uploaded documents</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
    </DashboardLayout>
  );
} 