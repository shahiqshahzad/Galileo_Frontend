import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Grid, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoaderComponent } from "utils/LoaderComponent";

// import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';
import { Stack } from "@mui/system";
import CategoriesScroll from "./scrollCategories";

const Categories = ({ categories, loading }) => {
  // const settings = {
  //   Arrows: false,
  //   dots: false,
  //   infinite: true,
  //   speed: 1000,
  //   autoplay: false,
  //   arrows: true,
  //   slidesToShow: 5,
  //   slidesToScroll: 5,
  //   responsive: [
  //     // {
  //     //     breakpoint: 1568,
  //     //     settings: {
  //     //         slidesToShow: 6,
  //     //         slidesToScroll: 3,
  //     //         infinite: true,
  //     //         dots: false
  //     //     }
  //     // },
  //     // {
  //     //     breakpoint: 1568,
  //     //     settings: {
  //     //         slidesToShow: 6,
  //     //         slidesToScroll: 3,
  //     //         infinite: true,
  //     //         dots: false
  //     //     }
  //     // },
  //     {
  //       breakpoint: 1200,
  //       settings: {
  //         slidesToShow: 5,
  //         slidesToScroll: 5,
  //         infinite: true,
  //         dots: false
  //       }
  //     },
  //     {
  //       breakpoint: 900,
  //       settings: {
  //         // fade:true,
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //         initialSlide: 2
  //       }
  //     },
  //     {
  //       breakpoint: 450,
  //       settings: {
  //         fade: true,
  //         infinite: true,
  //         speed: 500,
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //         initialSlide: 2
  //       }
  //     },
  //     {
  //       breakpoint: 425,
  //       settings: {
  //         fade: true,
  //         infinite: true,
  //         speed: 500,
  //         slidesToShow: 1,
  //         slidesToScroll: 1
  //       }
  //     }
  //   ]
  // };

  const theme = useTheme();
  const myDivRef = useRef(null);

  const navigate = useNavigate();
  const [divHeight, setDivHeight] = useState(null);
  let filtered = true;

  useEffect(() => {
    if (categories?.length && myDivRef?.current && divHeight === null) {
      const height = myDivRef.current.clientHeight;
      setDivHeight(height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, myDivRef]);

  return (
    <Grid container-fluid="true" sx={{ margin: "15px" }}>
      <Grid item xs={12} lg={12} md={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignsItem: "end", width: "97%" }}>
              <Typography
                className="app-text"
                color={theme.palette.mode === "dark" ? "#FFFFFF" : "black"}
                sx={{
                  fontSize: "22px",
                  textAlign: { xs: "center", md: "left", sm: "center" },
                  marginLeft: { md: "18px" },
                  textTransform: "capitalize"
                }}
              >
                Categories
              </Typography>
            </Box>
            <Box
              sx={{
                position: "relative",
                marginTop: "10px",
                marginLeft: "15px",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "115px",
                  height: "6px",
                  backgroundImage: "linear-gradient(to right, #2F53FF, #2FC1FF)",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px"
                }
              }}
            />
            <Box as="div" sx={{ width: "97%", borderBottom: "0.5px solid #CDCDCD80", marginLeft: "15px" }}></Box>
          </Grid>
        </Grid>
      </Grid>
      {loading === true ? (
        <LoaderComponent justifyContent={"center"} alignItems={"center"} />
      ) : (
        <Grid
          item
          xs={12}
          mt={2}
          sx={{
            // minHeight: "8rem",
            "*::-webkit-scrollbar": {
              height: "1px"
            },
            "*::-webkit-scrollbar-thumb": {
              backgroundColor: "transparent"
            }
          }}
        >
          <Stack
            ref={myDivRef}
            sx={{
              flexDirection: "row",
              gap: "1rem",
              flexWrap: "wrap",
              marginLeft: "1em"
            }}
          >
            {categories?.length ? (
              divHeight < 180 ? (
                <>
                  {categories.map((item, i) => {
                    return (
                      <Stack
                        key={i}
                        onClick={() => {
                          navigate("/marketplace", { state: { category: item, categoryfiltered: filtered } });
                        }}
                        sx={{
                          opacity: divHeight === null ? 0 : 1,
                          cursor: "pointer",
                          padding: "15px 35px",
                          borderRadius: "4px",
                          border: "1px solid #305CFF"
                        }}
                      >
                        <Typography variant="h4" color="#fff" className="app-text">
                          {item?.name}
                        </Typography>
                      </Stack>
                    );
                  })}
                  {/* <Slider className="categoryslider" {...settings}>
                {categories?.map((item, i) => (
                  <React.Fragment key={i}>
                    <Grid
                      sx={{
                        my: { xs: '10px', md: '0', sm: '10px' },
                        ml: {
                          xs: 5,
                          sm: 3,
                          md: 2,
                          lg: 2
                        },
                        mr: {
                          xs: 1,
                          md: 4,
                          lg: 4
                        }
                      }}
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <Card
                        sx={{
                          color: theme.palette.mode === 'dark' ? 'white' : '#404040',
                          background: theme.palette.mode === 'dark' ? '#181C1F' : 'white',
                          width: '100%',
                          maxWidth: '100%',
                          //  boxShadow: '1px 2px 6px #d3d3d3',
                          borderRadius: '3px',
                          marginBottom: '10px',
                          maxWidth: { xl: '100%' }
                        }}
                        onClick={() => {
                          navigate('/marketplace', {
                            state: {
                              category: item
                            }
                          });
                        }}
                      >
                        <CardActionArea>
                          <Box
                            // onClick={() => {
                            //   navigate('/marketplace', {
                            //     state: {
                            //       category: item
                            //     }
                            //   });
                            // }}
                            sx={{
                              position: 'relative',
                              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : '#f3f3f3'
                              // boxShadow: '1px 2px 9px #d3d3d3'
                            }}
                          >
                            <CardMedia component="img" height="200" image={item.image} />
                            <Box
                              sx={{
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                bgcolor: 'rgba(0, 0, 0, 0.54)',
                                color: 'white'
                              }}
                            >
                              <Typography className="categoreyName" variant="h4" color="#fff" sx={{ mt: 11 }}>
                                {item.name}
                              </Typography>
                            </Box>
                          </Box>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  </React.Fragment>
                ))}
              </Slider> */}
                </>
              ) : (
                <CategoriesScroll categories={categories} />
              )
            ) : (
              // ) : categories && categories?.length > 0 ? (
              //   <Grid
              //     mt={-3}
              //     container
              //     sx={{
              //       textAlign: 'center',
              //       marginLeft: { xs: '0px', md: '2px' },
              //       width: { md: '100%' },
              //       justifyContent: { md: 'left', lg: 'left', xs: 'center', sm: 'center' }
              //     }}
              //   >
              //     {categories?.map((item, i) => (
              //       <Grid
              //         key={i}
              //         className="cate-margin"
              //         sx={{ my: { xs: '0', md: '0', sm: '16px' }, mr: { md: 2, lg: 3.5 } }}
              //         item
              //         md={2}
              //         lg={2}
              //         xl={2}
              //         sm={3}
              //         xs={10}
              //       >
              //         <Card
              //           className="cate-width"
              //           sx={{
              //             color: theme.palette.mode === 'dark' ? 'white' : '#404040',
              //             background: theme.palette.mode === 'dark' ? '#181C1F' : 'white',

              //             // boxShadow: '1px 2px 6px #d3d3d3',
              //             borderRadius: '3px',
              //             marginLeft: { xs: '0px', md: '8px', lg: '25px' },
              //             width: { sm: '220px', md: '100%', lg: '245px', xl: '100%' }
              //           }}
              //           onClick={() => {
              //             navigate('/marketplace', {
              //               state: {
              //                 category: item
              //               }
              //             });
              //           }}
              //         >
              //           <CardActionArea>
              //             <Box
              //               // onClick={() => {
              //               //   navigate('/marketplace', {
              //               //     state: {
              //               //       category: item
              //               //     }
              //               //   });
              //               // }}
              //               sx={{
              //                 position: 'relative',
              //                 background: theme.palette.mode === 'dark' ? theme.palette.dark.main : '#f3f3f3'
              //                 // boxShadow: '1px 2px 9px #d3d3d3'
              //               }}
              //             >
              //               <CardMedia component="img" height="200" image={item.image} />
              //               <Box
              //                 sx={{
              //                   height: '100%',
              //                   position: 'absolute',
              //                   top: 0,
              //                   left: 0,
              //                   width: '100%',
              //                   bgcolor: 'rgba(0, 0, 0, 0.54)',
              //                   color: 'white'
              //                 }}
              //               >
              //                 <Typography className="categoreyName" variant="h4" color="#fff" sx={{ mt: 11 }}>
              //                   {item.name}
              //                 </Typography>
              //               </Box>
              //             </Box>
              //           </CardActionArea>
              //         </Card>
              //       </Grid>
              //     ))}
              //   </Grid>
              <Grid
                mt={0}
                mb={-3}
                container
                spacing={2}
                sx={{ justifyContent: { xs: "center", sm: "center", md: "left", lg: "left", xl: "left" } }}
              >
                <h3
                  className="noDatacat fontfamily"
                  sx={{ justifyContent: { xs: "center", sm: "center", md: "left", lg: "left", xl: "left" } }}
                >
                  No results found.
                </h3>
              </Grid>
            )}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
};

export default Categories;
