import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";  
import PropTypes from "prop-types";

const GemTable = ({data}) => {

    return (
        <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Color</TableCell>
                        <TableCell>Weight (ct)</TableCell>
                        <TableCell>Shape</TableCell>
                        <TableCell>Rarity</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Price ($)</TableCell>
                        <TableCell>Merchant</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.data?.map((gem) => (
                        <TableRow key={gem._id}>
                            <TableCell>{gem.name}</TableCell>
                            <TableCell>{gem.type}</TableCell>
                            <TableCell>{gem.color}</TableCell>
                            <TableCell>{gem.weight || "-"}</TableCell>
                            <TableCell>{gem.shape || "-"}</TableCell>
                            <TableCell>{gem.rarity || "-"}</TableCell>
                            <TableCell>{gem.status}</TableCell>
                            <TableCell>{gem.price ? `$${gem.price}` : "-"}</TableCell>
                            <TableCell>{gem.merchantId?.fullName || "Unknown"}</TableCell>
                            <TableCell>
                                <IconButton color="primary">
                                    <Edit />
                                </IconButton>
                                <IconButton color="error">
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};


GemTable.propTypes = {
    data: PropTypes.shape({
        data: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                type: PropTypes.string,
                color: PropTypes.string.isRequired,
                weight: PropTypes.number,
                shape: PropTypes.string,
                rarity: PropTypes.string,
                status: PropTypes.string.isRequired,
                price: PropTypes.number,
                merchantId: PropTypes.shape({
                    fullName: PropTypes.string,
                }),
            })
        ),
    }),
};

export default GemTable;
