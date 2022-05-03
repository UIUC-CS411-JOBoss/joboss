import { Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { BASE_URL } from "../../config";
import { RecommendItem } from "types/recommend";

const getRecommand = async (
  user_id: number | undefined,
  job_id: number | undefined
) => {
  return fetch(`${BASE_URL}/api/job/recommand`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      job_id,
    }),
  });
};

type RecommanddProps = {
  job_id: number | undefined;
  user_id: number | undefined;
};

const RecommandView = ({ job_id, user_id }: RecommanddProps) => {
  const [jobList, setJobList] = useState<RecommendItem[]>(
    [] as RecommendItem[]
  );

  useEffect(() => {
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await (await getRecommand(user_id, job_id)).json();
      setJobList(res.data as RecommendItem[]);
    })();
  }, [user_id, job_id]);

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Role Name</Th>
          <Th>Company</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {jobList.map((job) => (
          <Tr key={job.job_id}>
            <Td>{job.company_name}</Td>
            <Td>{job.job_title}</Td>
            <Td>
              <Button>Detail</Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default RecommandView;
