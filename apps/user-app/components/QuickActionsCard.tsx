'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
const QuickActionsCard = () => {
    const router = useRouter();
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push('/p2p')}>
                        Send Money
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push('/transfer')}>
                        Add Funds
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActionsCard;