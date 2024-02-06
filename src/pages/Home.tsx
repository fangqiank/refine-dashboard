import { Col, Row } from "antd";
import { UpcomingEvents } from "@/components/home/upcoming-events"
import { DealsChart } from "@/components/home/deals-chart"
import { TotalCountCard } from "@/components/home/total-count-card";
import { useCustom } from "@refinedev/core";
import { DASHBOARD_TOTAL_COUNTS_QUERY } from "@/graphql/queries";
import { DashboardTotalCountsQuery } from "@/graphql/types";
import {LatestActivities} from "@/components/home/latest-activities"
export const Home = () => {
	const {data, isLoading} = useCustom<DashboardTotalCountsQuery>({
		url: '',
		method: 'get',
		meta: {
			gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY
		}
	})
	return (
		<div>
			<Row
				gutter={[32,32]}
			>
				<Col
					xs={24}
					sm={24}
					xl={8}
				>
					<TotalCountCard 
						resource='companies'
						isLoading={isLoading}
						totalCount={data?.data.companies.totalCount}
					/>
				</Col>

				<Col
					xs={24}
					sm={24}
					xl={8}
				>
					<TotalCountCard
						resource='contacts' 
						isLoading={isLoading}
						totalCount={data?.data.contacts.totalCount}
					/>
				</Col>

				<Col
					xs={24}
					sm={24}
					xl={8}
				>
					<TotalCountCard 
						resource='deals'
						isLoading={isLoading}
						totalCount={data?.data.deals.totalCount}
					/>
				</Col>
			</Row>

			<Row
				gutter={[32, 32]}
				style={{
					marginTop: '32px'
				}}
			>
				<Col
					xs={24}
					sm={24}
					xl={8}
					style={{
						height: '460px'
					}}
				>
					<UpcomingEvents />
				</Col>

				<Col
					xs={24}
					sm={24}
					xl={16}
					style={{
						height: '460px'
					}}
				>
					<DealsChart />
				</Col>
			</Row>

			<Row
				gutter={[32, 32]}
				style={{
					marginTop: '32px'
				}}
			>
				<Col
					xs={24}
				>
					<LatestActivities />
				</Col>
			</Row>
			
		</div>	
	)
};
